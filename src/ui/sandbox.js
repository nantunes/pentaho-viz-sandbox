define([
  "codemirror",
  "pentaho/type/Context",
  "pentaho/data/Table",
  "./goldenData",
  "codemirror/mode/javascript/javascript",
  "css!codemirror/lib/codemirror.css"
], function(CodeMirror, Context, Table, datasets) {
  "use strict";

  // UI elements
  var select = document.getElementById("types");
  var render_output = document.getElementById("render_output");
  var data_area = document.getElementById("data_area");
  var error_area = document.getElementById("error_area");
  var error_area_header = document.getElementById("error_area_header");
  var render_btn = document.getElementById("render_btn");
  var dump_btn = document.getElementById("dump_btn");

  // UI actions
  select.onchange = vizChanged;
  error_area_header.onclick = showTestsArea;
  render_btn.onclick = modelChanged;
  dump_btn.onclick = dumpModel;

  for(var i = 0, ic = datasets.length; i !== ic; ++i) {
    var btn = document.createElement("button");
    btn.data = i;
    btn.innerHTML = "Dataset " + (i+1);

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
  var activeModelProperties = null;
  var ActiveModelClass = null;
  var activeModel = null;
  var activeView = null;

  sandboxContext.getAllAsync().then(function(types) {
    for(var i = 0, ic = types.length; i !== ic; ++i) {
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

    if(ActiveModelClass) {
      ActiveModelClass = null;
    }

    if(activeModel) {
      activeModel = null;
    }

    if(activeView) {
      activeView.dispose();
      activeView = null;
    }

    if(info) {
      ActiveModelClass = sandboxContext.get(info);

      activeModelProperties = {};

      var props = ActiveModelClass.meta.props;
      for(var i = 0, ic = props.length; i !== ic; ++i) {
        var prop = props[i];

        if(prop.required || !prop.isRoot) {
          activeModelProperties[prop.key] = prop.value;

          // HACK To support calc out of the box
          if(prop.key === "measure" && !prop.value) {
            activeModelProperties[prop.key] = "sales";
          }
          if(prop.key === "operation" && !!prop.value) {
            activeModelProperties[prop.key] = prop.value.toUpperCase();
          }
        }
      }

      activeModel = new ActiveModelClass(activeModelProperties);

      code.setValue(JSON.stringify(activeModelProperties, null, 2));

      activeModel.meta.viewClass.then(function(View) {
        activeView = new View(render_output, activeModel);

        if(!activeData) {
          activeData = new Table(datasets[0]);
        }

        activeView.setData(activeData).render().then(function() {
          console.log("Render after viz change", arguments);
        });
      });
    }
  }

  /**
   * Renders the viz.
   */
  function modelChanged() {
    if(activeView) {
      try {
        var newModel = JSON.parse(code.getValue());

        var props = activeView.model.meta.props;
        for(var i = 0, ic = props.length; i !== ic; ++i) {
          var prop = props[i];

          activeView.model.set(prop.key, newModel[prop.key] || prop.value);
        }

        activeView.render().then(function() {
          console.log("Render after button click", arguments);
        });
      } catch(e) {
        console.log(e);
      }
    }
  }

  function datasetChanged(event) {
    var btn = event.target;
    var index = btn.data;
    activeData = new Table(datasets[index]);

    if(activeView) {
      activeView.setData(activeData);
      activeView.render().then(function() {
        console.log("Render after dataset change", arguments);
      });
    }
  }

  /**
   * Dumps the active model to the console.
   */
  function dumpModel() {
    console.log(activeModel);
  }

  function showTestsArea() {
    if(error_area.style.height) {
      error_area.style.height = null;
    } else {
      error_area.style.height = "35%";
    }
  }
});
