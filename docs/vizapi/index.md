---
title: Pentaho Visualisation API
description: The Pentaho Visualisation API provides a unified way to visualize data across the Pentaho suite (Analyzer, PDI, CDF).
layout: sub-intro
---

# Overview
The Pentaho Visualisation API provides a unified way to visualize data across the Pentaho suite (Analyzer, PDI, CDF). The stock CCC charts provide a set of ready-to-use chart types, customisable and extendable.

Visualisations are implemented on top of the [Type API](another-page). That ensures out-of-the-box class inheritance capabilities (reducing code duplication), [change events](another-page), [validation](another-page), [configuration](another-page) and [serialization](another-page).

The framework includes 14 visualisation Models (chart types) and corresponding Views (chart implementations).

> **List them**

Views can be further customised by [configuration](another-page) (through [CCC extension points](another-page) in the case of the stock visualizations) to fit the desired look and feel. They are also interactive, exposing [actions](another-page) and showing [tooltips](another-page).

----

# Creating a visualisation
The following steps will walk you through the creating of a simple visualization. The complete code is available at [pentaho/pentaho-engineering-samples](https://github.com/pentaho/pentaho-engineering-samples). You can clone the sample code into a directory of your choosing.

## Prerequisites
- An npm registry compatible package manager like [yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com).

## Preparing the environment
{% include callout.html content="<p>You can skip this section if you choose to clone the sample repository.</p>
<p>In that case you just need to install the dependencies by typing <code>yarn install</code> or <code>npm install</code>.</p>
<p>Then continue to <a href='#implementing-a-custom-visualisation'>the next section</a>.</p>
" type="info" %}

### 1. Setting up the project
- Create a folder and initialize it (with `yarn init` or `npm init`);
- Add the VizAPI dependency: `yarn add @nantunes/viz-api` or `npm install @nantunes/viz-api --save`

### 2. Creating a simple container
- Create and edit an HTML file (e.g. `index.html`) with the following content:
```html
  <html>
  <head>
    <!-- load requirejs -->
    <script type="text/javascript" src="node_modules/requirejs/require.js"></script>

    <!-- load the VizAPI helper -->
    <script type="text/javascript" src="node_modules/@nantunes/viz-api/loader.js"></script>

    <script type="text/javascript">
      // use the VizAPI helper to apply requirejs dev environment configurations
      vizApiHelperDevRequireConfig(require, "node_modules/@nantunes/viz-api");

      require([
        "pentaho/type/Context",
        "pentaho/data/Table",
        "pentaho/visual/base/view",
        "pentaho/visual/samples/calc"
      ], function(Context, Table, baseViewFactory, calcFactory) {
        // Setup up a VizAPI context
        var context = new Context({application: "viz-api-sandbox"});

        // Prepare some test data
        var dataTable = new Table({
          model: [
            {name: "family", type: "string", label: "Family"},
            {name: "sales",  type: "number", label: "Sales"}
          ],
          rows: [
            {c: [{v: "plains", f: "Plains"}, 123]},
            {c: [{v: "cars",   f: "Cars"  }, 456]}
          ]
        });

        // Create the visualization model
        var CalcModel = context.get(calcFactory);
        var model = new CalcModel({
          "data": dataTable,
          "levels": {attributes: ["family"]},
          "measure": {attributes: ["sales"]},
          "operation": "avg"
        });

        // Create the visualization view
        var BaseView = context.get(baseViewFactory);
        BaseView.createAsync({
          domContainer: document.getElementById("viz_div"),
          width: 400,
          height: 200,
          model: model
        }).then(function(view) {
          // Render the visualization
          view.update();
        });
      });
    </script>
  </head>

  <body>
    <!-- div that will contain the visualization -->
    <div id="viz_div"></div>
  </body>
  </html>
```

### 3. Test your code
- Open the HTML file in a browser.
{% include callout.html content="<p>Directly opening the file through the filesystem will not work when using Google Chrome (and Chromium and possibly other browsers).</p>

<p>Security restrictions disallow the loading of local resources using XHR. That is currently required by the VizAPI to load localization bundles and other resources.</p>

<p>To overcome this limitation you can serve the project files with a HTTP server. There are several simple to use solutions:</p>

<b>Node:</b><pre>npm install -g node-static
static -p 8000</pre>

<b>PHP:</b><pre>php -S localhost:8000</pre>

<b>Python 2:</b><pre>python -m SimpleHTTPServer 8000</pre>

<b>Python 3:</b><pre>python -m http.server 8000</pre>

<b>Ruby:</b><pre>ruby -run -e httpd . -p 8080</pre>
" type="warning" %}

## Implementing a custom visualisation

### 1. Choose your Model

#### __ a) Create a new model / extend an existing one
##### ____ Visual Roles
##### ____ Validation

#### __ b) Reuse an existing model
(currently this implies changing the defaultView property of the model through configuration)


### 2. Create your View

#### __1. Render methods

#### __2. Interactivity
##### ____ Trigger Select actions
##### ____ Trigger Execute actions
##### ____ ~~Tooltips~~ [out of scope]
##### ____ ~~Printing / exporting~~ [out of scope]

#### __3. ~~Color pallets~~ [out of scope]

#### __4. ~~Themes~~ [2nd pass]

#### __5. ~~Localization~~ [2nd pass]

## Deploying your visualisation

### Packaging
> Explain the Pentaho Web Packaging, the package.json, the pentaho/service config, the bundling...
> 
> **How to package dependencies!** Webjars, feature, kar...

### Installing
> Copy to the deploy folder... Submit it to the marketplace?

----

# Configuring visualisations
> The config file location, its format, adding configuration rules, priorities, etc..

## Migrating Analyzer's settings
