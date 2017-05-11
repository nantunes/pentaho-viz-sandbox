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

This section describes how to package and deploy your visualization into the Pentaho platform.

## Prerequisites

- Java 1.8
- Maven >= 3.0.3
- A Pentaho platform container (Analyzer, PDI)

## Package information

The visualization must be wraped as a Pentaho Web Package. All packages must contain a file called `package.json`, holding the relevant metadata about the resources being deployed.

See [Pentaho Web Package description](pentaho-web-package) for a more detailed view.

## Bundling

The Pentaho platform is built on top of an OSGi container, so developers must provide their code as a bundle. Aditionally the required client side dependencies must also be provided to the platform as bundles.

See [packaging for deploy](bundling) for instructions.

## Installing

> Copy to the deploy folder... Submit it to the marketplace?
>  - Actual deploy. Copy paste the kar
>  - Marketplace?

----

# Configuring a visualization

> The config file location, its format, adding configuration rules, priorities, etc..

## Migrating Analyzer's settings
