---
title: Create a custom Bar chart visualization using D3
description: Walks you through the creation of a simple Bar chart visualization that uses the D3 graphics library.
layout: default
---

# Introduction

The following steps will walk you through the creation of a simple Bar chart visualization, 
using the Pentaho Visualization API and the amazing [D3](https://d3js.org/) graphics library.
 
The complete code of this sample is available at 
[pentaho/pentaho-engineering-samples/vizapi/samples/bar](https://github.com/pentaho/pentaho-engineering-samples).

# Prerequisites

- Basic JavaScript knowledge
- Basic D3 knowledge
- An npm registry compatible package manager like [yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com).

# Preparing the environment

While reading, you can either build the sample step-by-step or follow along with the complete code.

## a. Following with the complete code

```shell
# clone the repository
git clone https://github.com/pentaho/pentaho-sdk

# go to the sample's directory
cd pentaho-sdk/samples/viz-api/bar

# install the dependencies
npm install
# or: yarn install
```

## b. Building it yourself

1. Create a folder and then initialize it:

    ```shell
    # create the package.json file
    npm init
    
    # add and install the VizAPI dependency
    npm install @nantunes/viz-api --save
    # or: yarn add @nantunes/viz-api
    ```

2. Create a file named `index.html` and place the following content in it:

    ```html
    <!doctype html>
    <html>
      <head>
        <style>
          #viz_div {
            border: solid 1px #005da6;
            width: 400px;
            height: 200px;
          }
        </style>
       
        <!-- load requirejs -->
        <script type="text/javascript" src="node_modules/requirejs/require.js"></script>
    
        <!-- load the VizAPI dev bootstrap helper -->
        <script type="text/javascript" src="node_modules/@nantunes/viz-api/dev-bootstrap.js"></script>
    
        <script>
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
                {name: "productFamily", type: "string", label: "Product Family"},
                {name: "sales",         type: "number", label: "Sales"}
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
              "levels": {attributes: ["productFamily"]},
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

    This page will show the simplest (and kind of useless) visualization: a calculator, 
    which just displays the result of aggregating the values of one column of a dataset.
    That's why you have to create your own!

# Visualize it

Open `index.html` in a browser. You should see the text `The result is 289.5`.

{% include callout.html content="<p>Directly opening the file through the filesystem will not work when using 
Google Chrome (and possibly other browsers),
because of security restrictions that disallow the loading of local resources using XHR 
— a functionality that is required by the VizAPI to load localization bundles and other resources.</p>

<p>To overcome this limitation you need to serve the project files through an HTTP server. 
There are several simple-to-use solutions:</p>

<b>Node:</b><pre>npm install -g node-static
static -p 8000</pre>

<b>PHP:</b><pre>php -S localhost:8000</pre>

<b>Python 2:</b><pre>python -m SimpleHTTPServer 8000</pre>

<b>Python 3:</b><pre>python -m http.server 8000</pre>

<b>Ruby:</b><pre>ruby -run -e httpd . -p 8000</pre>
" type="warning" %}

# Quick background facts

## On visualizations...
 
A visualization is constituted by:

- One **model**, which _identifies_ the visualization and _defines_ it 
  in terms of the visual degrees of freedom it has (e.g. _X position_, _color_ and _size_) and 
  any major options that affect its rendering.

- One **view** (at least), which implements the actual rendering using chosen technologies (e.g. HTML, SVG, D3).

## On Bar charts...

The simplest of Bar charts shows a single _series_ of data: 
a list of pairs of a category and a measure, where each category can only occur in one of the pairs.

Each pair (i.e. each category) is represented by a _bar_ visual element, 
and is assigned a stripe of the horizontal space and all of the vertical space, 
in which the height of the bar encodes the measure value.

Thus, the simplest Bar chart has two main data-bound visual degrees of freedom, or, 
as they are called in the Visualization API, **visual roles**: 
_Category_ and _Measure_.
The values of the attributes mapped to visual roles are visually encoded using visual variables/properties such as 
position, size, orientation or color.

# Creating the Bar model

## Complete model code

Create a file named `model.js` and place the following code in it:

```js
define([
  "module",
  "pentaho/visual/base"
], function(module, baseModelFactory) {
  
  "use strict";
  
  return function(context) {
    
    var BaseModel = context.get(baseModelFactory);
    
    var BarModel = BaseModel.extend({
      type: {
        id: "pentaho/visual/samples/bar",
        sourceId: module.id,
        defaultView: "./view-d3",
        props: [
          {
            name: "barSize",
            type: "number",
            value: 30,
            isRequired: true
          },
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
    
    return BarModel;
  };
});
```

Remarks:
  - The value of the AMD module is a factory function of Bar model classes.
  - Defines a visualization (model) of id `pentaho/visual/samples/bar`.
  - Inherits directly from the base visualization model, `pentaho/visual/base`.
  - Specifies the default view to use with this model (which you'll create in a moment).
  - Two main property types exist: general and visual roles.
  
The following sections explain each of the model properties.
  
## The `barSize` property

```js
specification = {
  name: "barSize",
  type: "number",
  value: 30,
  isRequired: true
}
```

A simple property to determine the constant width of bars. 
It is of type `number`, is required and has a default value of `30`. That's as simple as it gets.

## The `category` property

```js
specification = {
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

## The `measure` property

```js
specification = {
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

## Additional model metadata

The model could still be enriched in several ways:

- Providing localized labels/descriptions for the name of the visualization and that of its properties.
- Providing standard icons for supported Pentaho themes.
- Configuring additional validation rules.
- ...

However, these are all accessory and can be done anytime.
Now you can't wait to see something shining on the screen, so let's move on into creating the view.

# Creating the Bar View

## Skeleton view code

Create a file named `view-d3.js` and place the following code in it:

```js
define([
  "module",
  "pentaho/visual/base/view",
  "./model",
  "d3"
], function(module, baseViewFactory, barModelFactory, d3) {

  "use strict";

  return function(context) {

    var BaseView = context.get(baseViewFactory);

    var BarView = BaseView.extend({
      type: {
        id: module.id,
        props: [
          {
            name: "model",
            type: barModelFactory
          }
        ]
      },
      
      _updateAll: function() {
        d3.select(this.domContainer).text("Hello World!");
      }
    });

    return BarView;
  };
});
```

Remarks:
  - Defines a visualization view type of id `pentaho/visual/samples/bar/view`.
  - Inherits directly from the base visualization view, `pentaho/visual/base/view`.
  - The inherited `model` property is overridden so that its `type` is the Bar model you previously created.
  - The `_updateAll` method is where the code that fully renders the visualization must go, 
    and, for now, it simply uses d3 to output `"Hello World!"` in the view's DOM element, `domContainer`.

## Installing D3

Execute the following:

```shell
# add and install the D3 dependency
npm install d3 --save
# or: yarn add d3
```

## Adapting the HTML sandbox

Edit the `index.html` file and place the following code in it.

```html
<html>
<head>
  <style>
    #viz_div {
      border: solid 1px #005da6;
      width: 400px;
      height: 200px;
    }
  </style>

  <script type="text/javascript" src="node_modules/requirejs/require.js"></script>

  <script type="text/javascript" src="node_modules/@nantunes/viz-api/dev-bootstrap.js"></script>

  <script>
    require.config({
      packages: [
        {
          "name": "pentaho/visual/samples/bar",
          "main": "model",
          "location": "."
        }
      ],
      paths: {
        "d3": "./node_modules/d3/build/d3"
      }
    });
  </script>

  <script>
    require([
      "pentaho/type/Context",
      "pentaho/data/Table",
      "pentaho/visual/base/view",
      "pentaho/visual/samples/bar"
    ], function(Context, Table, baseViewFactory, barModelFactory) {

      // Setup up a VizAPI context
      var context = new Context({application: "viz-api-sandbox"});

      // Prepare some test data
      var dataTable = new Table({
        model: [
          {name: "productFamily", type: "string", label: "Product Family"},
          {name: "sales",         type: "number", label: "Sales"}
        ],
        rows: [
          {c: [{v: "plains", f: "Plains"}, 123]},
          {c: [{v: "cars",   f: "Cars"  }, 456]}
        ]
      });

      // Create the visualization model.
      var BarModel = context.get(barModelFactory);
      var model = new BarModel({
        "data": dataTable,
        "category": {attributes: ["productFamily"]},
        "measure":  {attributes: ["sales"]},
        "barSize":  20
      });

      // Create the visualization view.
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
  <div id="viz_div"></div>
</body>
</html>
```

Remarks:
  - A script block was added with the AMD/RequireJS configuration of the Bar and D3 packages.
  - The used visualization model is now `pentaho/visual/samples/bar`.
  - The model now contains visual role mappings for the `category` and `measure` visual roles.

Now, refresh the `index.html` page in the browser, and you should read `Hello World!`.

## Implementing the render code

## Handling interactivity

### Implementing the Bar select action

### Implementing the Bar execute action


### __1. Render methods

### __2. Interactivity
#### ____ Trigger Select actions
#### ____ Trigger Execute actions
#### ____ ~~Tooltips~~ [out of scope]
#### ____ ~~Printing / exporting~~ [out of scope]

### __3. ~~Color pallets~~ [out of scope]

### __4. ~~Themes~~ [2nd pass]

### __5. ~~Localization~~ [2nd pass]
