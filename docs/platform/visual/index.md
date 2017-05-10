---
title: Pentaho Visualization API
description: The Pentaho Visualization API provides a unified way to visualize data across the Pentaho suite (Analyzer, PDI, CDF).
layout: sub-intro
---

# Overview

The Pentaho Visualization API provides a unified way to visualize data across the Pentaho suite 
(e.g.
[Analyzer](http://www.pentaho.com/product/business-visualization-analytics), 
[PDI](http://www.pentaho.com/product/data-integration), 
[CDF](http://community.pentaho.com/ctools/cdf/)).
Essentially, it is a set of abstractions that ensures total isolation between 
applications, 
visualizations and 
configurations (the glue).

Visualizations are constituted by one [Model]({{site.refDocsUrlPattern | replace: '$', 'pentaho.visual.base.Model'}}) 
and (at least) one [View]({{site.refDocsUrlPattern | replace: '$', 'pentaho.visual.base.View'}}).
Models identify visualizations and 
define their data requirements. Views implement the actual rendering using chosen technologies 
(e.g. [HTML](https://www.w3.org/TR/html/), [SVG](https://www.w3.org/TR/SVG/), [D3](https://d3js.org/)),
and handle user interaction, 
dispatching [actions]({{site.refDocsUrlPattern | replace: '$', 'pentaho.visual.action'}}) and, 
for example, showing tooltips.

Visualizations are implemented on top of the Pentaho Core, Type and Data JavaScript APIs:
- Using the [Type API]({{site.refDocsUrlPattern | replace: '$', 'pentaho.type'}}) 
  endows visualizations with out-of-the-box class inheritance, metadata support, type configuration, 
  validation, serialization, among other features.
- Using the [Data API]({{site.refDocsUrlPattern | replace: '$', 'pentaho.data'}}) 
  ensures seamless integration with data sources in the Pentaho platform, 
  as well as with other client-side component frameworks.
- Using [Core APIs]()
  provides visualizations with features such as localization, theming and registration.
  
The use of [Pentaho Platform JavaScript APIs]({{site.refDocsUrlPattern | replace: '$', 'pentaho'}}) for anything not 
directly related with the visualization concept, 
ensures developers can reuse knowledge that they gain in other components of the Pentaho suite 
to build visualizations and vice-versa.

The Pentaho Visualization API comes with a set of stock visualizations, 
covering the most common chart-types.
Most stock visualizations are based on the [CCC](http://community.pentaho.com/ctools/ccc/) chart library,
which means that the stock visualizations are _super-configurable_ to suite your organization's preferred style.

# Creating a visualization

- [Bar/D3 sample](samples/bar-d3-sandbox) — walks you through creating a custom visualization 
  having a [D3](https://d3js.org/)-based view.

# Deploying a visualization

## Packaging
> Explain the Pentaho Web Packaging, the package.json, the pentaho/service config, the bundling...
> 
> **How to package dependencies!** Webjars, feature, kar...


- (one page) Do the walkthrough
  - Prerequisites
    - Maven >= 3.0.3
    - Java 1.8
    - PDI EE (DET)
    - Pentaho-server EE (Analyzer)
    - Pentaho-server CE (CTools)
  - Actual deploy. Copy paste the kar

- (another page) Explain the package.json
  - module id + version
  - dependencies + require configurations black magic
  - pentaho/service
    - explain that this is a kind dependency injection
    - registering a viz
    

- (another page) Packaging for deploy. 
  - OSGI? bundles and Kars?
  - Maven project structure starting with the maven archetype. 
    - _Do not inherit from pentaho parent POMs_
    - _We need to check where/how to publish the archetype_
  - Explain the folder structure
  	- What are the assemblies (generating kar) 
  	- What are the impl (the actual viz)
  	  - ~Blueprint~ Keep it to a minimum. Just mentioned that this file is used to specify where (URL) the JS code will be available from
  - Adding (client) dependencies
    - NPM => Maven/webjars. 
      - We need to use webjars. 
      - Explain why and what they are
      - Where to get / create new webjars
    - package.json => webjars + bunbling them
      - Say that dependencies are only included in the feature file. No need to specify they are added to the POM dependencies. 
  
  
- Marketplace?

## Installing
> Copy to the deploy folder... Submit it to the marketplace?

----

# Configuring a visualization
> The config file location, its format, adding configuration rules, priorities, etc..

Use the maven archetype





## Migrating Analyzer's settings
