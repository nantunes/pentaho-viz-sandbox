---
title: Pentaho Visualization API
description: The Pentaho Visualization API provides a unified way to visualize data across the Pentaho suite (Analyzer, PDI, CDF).
layout: sub-intro
---

# Overview
The Pentaho Visualization API provides a unified way to visualize data across the Pentaho suite (Analyzer, PDI, CDF).
The stock CCC charts provide a set of ready-to-use chart types, customizable and extensible.

Visualizations are implemented on top of the [Type API](another-page).
That ensures out-of-the-box class inheritance capabilities (reducing code duplication), 
[change events](another-page), [validation](another-page), [configuration](another-page) and 
[serialization](another-page).

The framework includes 14 visualization Models (chart types) and corresponding Views (chart implementations).

> **List them**

Views can be further customized by [configuration](another-page) 
(through [CCC extension points](another-page) in the case of the stock visualizations) to fit the desired look and feel.
They are also interactive, exposing [actions](another-page) and showing [tooltips](another-page).

----

# Creating a visualization
The following steps will walk you through the creation of a simple visualization. 
The complete code is available at 
[pentaho/pentaho-engineering-samples](https://github.com/pentaho/pentaho-engineering-samples). 
You can clone the sample code into a directory of your choosing.

## Prerequisites
- An npm registry compatible package manager like [yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com).

## Preparing the environment
{% include callout.html content="<p>You can skip this section if you choose to clone the sample repository.</p>
<p>In that case you just need to install the dependencies by typing <code>yarn install</code> or 
<code>npm install</code>.</p>
<p>Then continue to <a href='#implementing-a-custom-visualization'>the next section</a>.</p>
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

    <!-- load the VizAPI dev bootstrap helper -->
    <script type="text/javascript" src="node_modules/@nantunes/viz-api/dev-bootstrap.js"></script>

    <script type="text/javascript">
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
This will show the simplest (and most useless) visualization: a calculator, 
which just displays the result of aggregating the values of one column of a dataset. 
That's why you'll create your own!

### 3. Test your code
- Open the HTML file in a browser.
{% include callout.html content="<p>Directly opening the file through the filesystem will not work when using 
Google Chrome (and Chromium and possibly other browsers).</p>

<p>Security restrictions disallow the loading of local resources using XHR. That is currently required by the VizAPI to 
load localization bundles and other resources.</p>

<p>To overcome this limitation you can serve the project files with a HTTP server. 
There are several simple to use solutions:</p>

<b>Node:</b><pre>npm install -g node-static
static -p 8000</pre>

<b>PHP:</b><pre>php -S localhost:8000</pre>

<b>Python 2:</b><pre>python -m SimpleHTTPServer 8000</pre>

<b>Python 3:</b><pre>python -m http.server 8000</pre>

<b>Ruby:</b><pre>ruby -run -e httpd . -p 8000</pre>
" type="warning" %}

## Implementing a custom visualization

A visualization is composed of one model and (at least) one view.
The model defines a certain kind of visualization,
in terms of the visual degrees of freedom it has (like _category_, _color_ and _size_) and 
any major options that affect its rendering.
A view implements the actual rendering using chosen technologies.

In this walk-through, you'll implement a simple Bar chart visualization using the amazing D3 graphics library.

### 1. Defining the Model

The simplest Bar chart shows a single series of data, 
one bar per _category_, having a height proportional to a numeric _measure_. 
Thus, there are two main visual degrees of freedom, or, as called in the Visualization API, **visual roles**,
_Category_ and _Measure_. The value of the first is visually encoded by the _horizontal position_ of bars and, 
the second, by the _height_ of bars.

#### Skeleton Model

Start by creating a folder named `"bar"` and, in it, creating a file named `model.js`.
Then, place the following code in it:

```js
// bar/model.js (step 1)
define([
  "module",
  "pentaho/visual/base"
], function(module, baseModelFactory) {
  
  // Return the Model factory function.
  return function(context) {
    
    // Obtain the base Model class from the context, given the base Model's factory function.
    var BaseModel = context.get(baseModelFactory);
    
    // Return the Bar model class.
    return BaseModel.extend({
      type: {
        // This is the id of the model (and of the visualization).
        id: "pentaho/visual/samples/bar",
        
        // The AMD/RequireJS module id of the visualization.
        sourceId: module.id,
        
        // The default view to use to render this visualization is
        // a sibling module named `view.js`.
        defaultView: "./view"
      }
    });
  };
});
```

This defines a visualization model type, of id `pentaho/visual/samples/bar`, 
that inherits directly from the base visualization model, `pentaho/visual/base`,
but says nothing specific (yet) about Bar charts.

#### Complete Model

The following is the Bar chart visualization model, 
where the `props` attribute was added, 
containing Bar-specific properties:

```js
// bar/model.js (step 2)
define([
  "module",
  "pentaho/visual/base"
], function(module, baseModelFactory) {
  
  return function(context) {
    
    var BaseModel = context.get(baseModelFactory);
    
    return BaseModel.extend({
      type: {
        id: "pentaho/visual/samples/bar",
        sourceId: module.id,
        defaultView: "./view",
        props: [
          // General properties
          {
            name: "barSize",
            type: "number",
            value: 30,
            isRequired: true
          },
          
          // Visual role properties
          {
            name: "category",
            type: {
              base: "pentaho/visual/role/ordinal",
              props: {attributes: {isRequired: true, countMax: 1}}
            }
          },
          {
            name: "measure",
            type: {
              base: "pentaho/visual/role/quantitative",
              dataType: "number",
              props: {attributes: {isRequired: true, countMax: 1}}
            }
          }
        ]
      }
    });
  };
});
```

The following sections explain each of the properties.
  
#### The `barSize` property

```js
barSizeSpec = {
  name: "barSize",
  type: "number",
  value: 30,
  isRequired: true
}
```

A simple property to determine the constant width of bars. 
It is of type `number`, is required and has a default value of `30`. That's as simple as it gets.

#### The `category` property

```js
categorySpec = {
  name: "category",
  type: {
    base: "pentaho/visual/role/ordinal",
    props: {attributes: {isRequired: true, countMax: 1}}
  }
}
```

Represents the _Category_ visual role. Being _ordinal_ means that it can visually encode discrete values 
and their relative order.

The [data](http://) property, which is inherited from the base visualization model, 
is given a dataset containing data for attributes such as _Product Family_ and _Sales_.
The value of a visual role contains the names of the data attributes that are _mapped_ to it,
e.g.: `{attributes: ["productFamily"]}`. 
So, the value of a visual role is an object with a list property named `attributes`.

Because by default, any number of data attributes can be mapped to a visual role, including 0 or 10, 
it is necessary to derive the `pentaho/visual/role/ordinal` visual role type to limit the cardinality 
limits of its `attributes` property, so that it accepts and requires a single data attribute.

#### The `measure` property

```js
measureSpec = {
  name: "measure",
  type: {
    base: "pentaho/visual/role/quantitative",
    dataType: "number",
    props: {attributes: {isRequired: true, countMax: 1}}
  }
}
```

Represents the _Measure_ visual role. Being _quantitative_ means that it can visually represent
the proportion between values (_this is twice that_).
Additionally, to prevent a data attribute of type `date` to be mapped to the visual role, 
its `dataType` is restricted to `number`.

#### Additional Metadata

The model could still be enriched by providing localized labels/descriptions for the name of the visualization
and its properties, or providing standard icons for supported Pentaho themes. 
However, you can define these anytime, and now you can't wait to see something shining on the screen,
so let's move on into creating a visualization view.

### 2. Create your View

You'll be creating a D3-based bar chart view for the visualization.

#### __1. Render methods

#### __2. Interactivity
##### ____ Trigger Select actions
##### ____ Trigger Execute actions
##### ____ ~~Tooltips~~ [out of scope]
##### ____ ~~Printing / exporting~~ [out of scope]

#### __3. ~~Color pallets~~ [out of scope]

#### __4. ~~Themes~~ [2nd pass]

#### __5. ~~Localization~~ [2nd pass]

## Deploying your visualization

### Packaging
> Explain the Pentaho Web Packaging, the package.json, the pentaho/service config, the bundling...
> 
> **How to package dependencies!** Webjars, feature, kar...

### Installing
> Copy to the deploy folder... Submit it to the marketplace?

----

# Configuring visualizations
> The config file location, its format, adding configuration rules, priorities, etc..

## Migrating Analyzer's settings
