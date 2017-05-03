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

## Creating your visualization

Read the [Bar/D3 sample](samples/bar-d3) walk-through to learn how to create a custom visualization
using the [D3](https://d3js.org/) library for rendering.

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
