# Overview
The Pentaho Visualisation Framework provides a unified way to visualize data across the Pentaho suite (Analyzer, PDI, CDF). The stock CCC charts provide a set of ready-to-use chart types, customisable and extendable.

Visualisations are implemented on top of the Pentaho Web Framework's [Type System](). That ensures out-of-the-box class inheritance capabilities (reducing code duplication), [change events](), [validation](), [configuration]() and [serialization]().

The framework includes 14 visualisation Models (chart types) and corresponding Views (chart implementations).

> **List them**

Views can be further customised by [configuration]() (through [CCC extension points]() in the case of stock viz) to fit the desired look and feel. They are also interactive, exposing [actions]() and showing [tooltips]().

> Should we mention the Pentaho Web Framework's [Data Access package]()?

----

# Creating a visualisation
> Provide the instructions to clone the sample repository.

## Preparing the environment
> The objective is to provide / guide to the creation of a setup where the developer can simply open an .html file and see a chart (like in https://developers.google.com/chart/interactive/docs/quick_start).

### 1. Loading the library
> Would be great to just `npm install pentaho/viz-api`... Even if not published in the public npm registry, Nexus includes its won (https://pentaho-engineering.slack.com/archives/C1N63MHB4/p1467994662000037).
> 
> What's the alternative? Include a copy of it in the sample repo? Loading from a local server instalation? `npm install https://github.com/pentaho/pentaho-platform-plugin-common-ui.git`?

### 2. Setting up a simple container
### 3. Preparing test data
### 4. Loading a stock visualisation

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
