define([
  "codemirror",
  "pentaho/type/Context",
  "pentaho/data/Table",
  "./goldenData",
  "codemirror/mode/javascript/javascript",
  "css!codemirror/lib/codemirror.css"
], function(CodeMirror, Context, Table, datasets) {
  "use strict";

  /* globals document:false */

  // UI elements
  var select = document.getElementById("types");
  var render_output = document.getElementById("render_output");
  var data_area = document.getElementById("data_area");
  var error_area = document.getElementById("error_area");
  var error_area_header = document.getElementById("error_area_header");
  var render_btn = document.getElementById("render_btn");
  var dump_btn = document.getElementById("dump_btn");

  var error_lines = [];

  // UI actions
  select.onchange = vizChanged;
  error_area_header.onclick = showTestsArea;
  render_btn.onclick = modelChanged;
  dump_btn.onclick = dumpModel;

  for (var i = 0, ic = datasets.length; i !== ic; ++i) {
    var btn = document.createElement("button");
    btn.data = i;
    btn.innerHTML = "Dataset " + (i + 1);

    btn.onclick = datasetChanged;

    data_area.appendChild(btn);
  }

  var code = CodeMirror.fromTextArea(document.getElementById("output"), {
    lineNumbers: true,
    mode: {name: "javascript", json: true}
  });

  // viz stuff
  var sandboxContext = new Context();

  var activeData = null;
  var activeView = null;

  sandboxContext.getAllAsync().then(function(types) {
    for (var i = 0, ic = types.length; i !== ic; ++i) {
      var type = types[i].meta;

      var opt = document.createElement("option");
      opt.value = type.id;
      opt.innerHTML = type.label || type.id;

      opt.data = types[i];

      select.appendChild(opt);
    }
  });

  function vizChanged() {
    var info = select.options[select.selectedIndex].data;

    code.setValue("");
    render_output.innerHTML = "";

    if (activeView) {
      activeView.dispose();
      activeView = null;
    }

    if (info) {
      var ModelClass = sandboxContext.get(info);

      var activeModelProperties = {};

      ModelClass.meta.each(function(prop) {
        if (prop.key === "data") {
          if (!activeData) {
            activeData = new Table(datasets[0]);
          }

          activeModelProperties.data = activeData;
        } else if (prop.required || !prop.isRoot) {
          activeModelProperties[prop.key] = prop.value;

          // HACK To support calc out of the box
          if (prop.key === "measure" && !prop.value) {
            activeModelProperties[prop.key] = "sales";
          }
          if (prop.key === "operation" && !!prop.value) {
            activeModelProperties[prop.key] = prop.value.value.toUpperCase();
          }
        }
      });

      var model = new ModelClass(activeModelProperties);

      delete activeModelProperties.data;
      code.setValue(JSON.stringify(activeModelProperties, null, 2));

      model.meta.viewClass.then(function(View) {
        activeView = new View(render_output, model);

        callValidation();
        activeView.render();
      });
    }
  }

  /**
   * Renders the viz.
   */
  function modelChanged() {
    if (activeView) {
      try {
        var newModel = JSON.parse(code.getValue());

        activeView.model.meta.each(function(prop) {
          if (prop.key !== "data") {
            activeView.model.set(prop.key, newModel[prop.key] != null ? newModel[prop.key] : prop.value);
          }
        });

        activeView.model.set("data", activeData);

        callValidation();
        activeView.render();
      } catch (e) {
        console.log(e);
      }
    }
  }

  function datasetChanged(event) {
    var btn = event.target;
    var index = btn.data;
    activeData = new Table(datasets[index]);

    if (activeView) {
      activeView.model.set("data", activeData);

      callValidation();
      activeView.render();
    }
  }

  function callValidation() {
    code.operation(function () {
      for (var i = 0, ic = error_lines.length; i !== ic; ++i) {
        code.removeLineWidget(error_lines[i]);
      }
      error_lines.length = 0;

      var errors = activeView.model.validate();

      if (errors) {
        for (var i in errors) {
          var error = errors[i];

          var msg = document.createElement("div");
          var icon = msg.appendChild(document.createElement("span"));
          icon.innerHTML = "!";
          icon.className = "code-editor-error-icon";
          msg.appendChild(document.createTextNode(error.message));
          msg.className = "code-editor-error";
          error_lines.push(code.addLineWidget(0, msg, {
            coverGutter: false,
            noHScroll: true,
            above: true,
            inline: true
          }));
        }
      }
    });
  }

  /**
   * Dumps the active model to the console.
   */
  function dumpModel() {
    console.log(activeView.model);
  }

  function showTestsArea() {
    if (error_area.style.height) {
      error_area.style.height = null;
    } else {
      error_area.style.height = "35%";
    }
  }
});
