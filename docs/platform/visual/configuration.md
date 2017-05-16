---
title: Configuration of javascript objects
description: The Configuration API provides a means for types to be configured by third-parties.
parent-title: Visualization API
layout: default
---

## Introduction

The Configuration API provides a means for _types_ to be configured by third-parties.
_Types_ are known by their _string_ identifier and are, for all other purposes, opaque entities
— these may or may not exist as actual classes, or may simply represent an interface type.

The configurations are declared in AMD/RequireJS modules that return an instance of 
[`pentaho.config.IRuleSet`]({{site.refDocsUrlPattern | replace: '$', 'pentaho.config.IRuleSet'}}).
These modules must be advertised to [`pentaho/system`]({@link pentaho/system}), 
using the service id `pentaho.config.IRuleSet`, to be visible to the configuration system.

The configuration system merges multiple configurations that target the same type.

Perhaps the most likely use case involving the Configuration API is a user wanting to modify the default settings 
with which new visualizations are created in a given application.

Both model and view classes can be configured.

Examples of typical model configurations:
- invalidate the visualization if the supplied data has the wrong type 
- setting the default line width of a line chart
- define the minimum and maximum 
- define the default view class

Examples of typical view configurations:
- define the margins
- configure an extension point of a CCC visualization

## Configuring a visualization

The following is an example of a configuration module that declares two rules:

```javascript
define(function(){
  
  "use strict";
  
  // Fist rule: 
  // hide pie charts
  var noPieCharts = {
    select: {
      type: "pentaho/visual/models/pie"
    },
    apply: {
      isBrowsable: false
    }
  };
  
  // Second rule:
  // in Analyzer, for all Line and Bar/Line charts, 
  // change the default line width to 2
  // and change the default dot shape
  var defaultLineWidthAndShapeInAnalyzer = {
    select: {
      application: "pentaho-analyzer",
      type: [
        "pentaho/visual/models/line",
        "pentaho/visual/models/barLine"
      ]
    },
    apply: {
      props: {
        lineWidth: {
          value: 2
        },
        shape: {
          value: "diamond"
        }
      }
    }
  };
   
  // return a list of rules (as a pentaho.config.IRuleSet object)
  return {
    rules: [ 
      noPieCharts, 
      defaultLineWidthAndShapeInAnalyzer 
    ]
  };
});
```

The first configuration rule hides the pie chart (and any charts that derive from it) 
from the list of available visualizations. 
It instructs the applications that the visualization's model type should not be offered.
Indirectly, it means that no view using this model will be used.

The second rule applies only to Analyzer, and modifies the default values of two properties ("lineWidth" and "shape") 
defined in the Line and Bar/Line visualizations.
Apart from its default `value`, a property's type has other attributes, such as `label`.

In general, each configuration rule is an object that:
- contains a mandatory `select` object, which restricts the span of types targeted by this rule. 
This span can be specified by using the following attributes:
  + `type`: the identifier of the targeted AMD module (or list of module identifiers);
  + `application`:  the identifier of the targeted application (or list of applications), 
  e.g. `"pentaho-analyzer"` or `["pentaho-analyzer", "pentaho-det"]`;
  + `user`: the user name (or list of user names);
  + `theme`: the theme (or list of themes), e.g. (`"sapphire"` or `["crystal", "sapphire"]`);
  + `locale`: the locale
- contains an `apply` object, which defines overrides for the properties of the targeted objects. 
You will need to consult the reference documentation of the target type to get the list of available properties. 
- can contain a numeric `priority` (higher values have higher priority), which can be useful for overriding other rules.

Please consult the 
[reference documentation on the Configuration API]({{site.refDocsUrlPattern | replace: '$', 'pentaho.config'}})
for more details.

## Registering a configuration

System administrators can readily add their own configuration rules by editing `config.js` files on predefined locations. 
- On PDI: `data-integration/system/karaf/config/web-config/config.js`
- On the Pentaho Server: `pentaho-solutions/system/karaf/config/web-config/config.js`

These files are shipped with a small set of illustrative (but commented-out) rules.
Please note that these files will be overwritten during upgrades.

An alternative is to use a Pentaho Web Package to distribute user configurations.
Custom visualizations can thus be distributed together with their configuration rules.
