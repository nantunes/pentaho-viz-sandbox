---
title: Pentaho Visualization API
description: The Pentaho Visualization API provides a unified way to visualize data across the Pentaho suite (Analyzer, PDI, CDF).
layout: sub-intro
---

# Overview

The Pentaho Visualization API provides a unified way to visualize data across the Pentaho suite (Analyzer, PDI, CDF).
The stock CCC charts provide a set of ready-to-use chart types, customizable and extensible.

Visualizations are implemented on top of the 
[Type API]({{site.refDocsUrlPattern | replace: '$', 'pentaho.type'}}).
That ensures out-of-the-box class inheritance capabilities (reducing code duplication), 
[change events](another-page), 
[validation](another-page), 
[configuration](another-page) and 
[serialization](another-page).

The framework includes 14 visualization Models (chart types) and corresponding Views (chart implementations).

> **List them**

Views can be further customized by [configuration](another-page) 
(through [CCC extension points](another-page) in the case of the stock visualizations) to fit the desired look and feel.
They are also interactive, exposing [actions](another-page) and showing [tooltips](another-page).

----

# Creating a visualization

Read the [Bar/D3 sample](samples/bar-d3-sandbox) walk-through to learn how to create a custom visualization
using the [D3](https://d3js.org/) library for rendering.

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
