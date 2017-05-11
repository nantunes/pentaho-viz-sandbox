---
title: Analyzer and the Future Visualization API
description: Covers the availability of the future Visualization API in Analyzer,
             the differences between stock visualizations of the current and future format, 
             how to enable or disable the stock visualizations of the future format and 
             how to migrate custom settings.
parent-title: Visualization API
layout: default
---

## Overview

[Pentaho Analyzer](http://www.pentaho.com/product/business-visualization-analytics) reports display visualizations that 
are based on the [Pentaho Visualization API](..).

As of 7.1, the Pentaho platform ships with the future Visualization API, (internal) version 3.0-**beta**, 
**side-by-side** with the current version, 2.0.
 
Analyzer now also supports visualizations of both formats,
allowing you 
to evaluate and immediately take advantage of the future format, and 
to convert any custom visualizations of the current format at your own pace.

All **stock visualizations**, with the exception of the Geo Map, are already available in the future format 
and you **can choose** which format you want Analyzer to use, by configuring an Analyzer setting
(see [Changing the visualization format of stock visualizations](Changing-the-visualization-format-of-stock-visualizations)).
This setting **does not** affect reports that use a custom (non-stock) visualization — 
these will continue to use their visualization format, whether it is the current or future.

Once you choose to use the future format of stock visualizations, 
_viewing_ a previously saved report, with a current format visualization, 
will not change it in any way. 
However, if you save it, it will be irreversibly upgraded to use the future format.
If you later decide to switch-back Analyzer to using the current format of stock visualizations,
the visualization part of this report will not be available and 
the report will be displayed in the Pivot table view.

Fresh Pentaho installations are configured to use the future stock visualizations, 
while upgrade installations are configured to keep using the current stock visualizations.


## Differences between the stock visualizations of the current and future formats

The future stock visualizations are **not** totally identical to 
the corresponding current ones. 
Some differences are intended, and arise from the will to fix certain parts of their design, 
while other are due to the development of the future visualizations not being totally complete.

The following sections describe the differences that _future_ stock visualizations have 
relative to the _current_ stock visualizations.

### Usability and Style

1. Visualizations scroll horizontally and vertically when too many axis categories exist, 
   instead of shrinking to available space.
2. Selection is either enabled or not, depending on whether there are no gems in the 
   Pivot "Column" gem bar, while there used to be an intermediate selection state where some 
   partial selections were possible if only one gem was in the Pivot "Column" gem bar.
3. General styling of visualizations changed to be aligned platform-wide (e.g. PDI, CDF).
4. Standard color palettes have changed to be aligned platform-wide (e.g. PDI, CDF).

### Breaking changes

1. Visualization configuration is performed in a different way, 
   so existing Analyzer visualization configurations need to be migrated;
   see [Migrating visualization settings](Migrating-visualization-settings).
2. Custom translations for properties of stock visualizations may not work anymore.

### Incomplete work

1. Printing of scrolled charts shrinks them to fit, breaking their aspect-ratio.
2. Printing does not reflect custom configurations.


## Changing the visualization format of stock visualizations.

In a Pentaho Server installation, go to the Analyzer plugin folder, 
located at `pentaho-server/pentaho-solutions/system/analyzer` and 
open the `settings.xml` file.

Find the `<viz-api-version>` setting and change its value according to the desired stock visualization format:

* Use the current format: 
  ```xml
  <viz-api-version>2.0</viz-api-version>
  ```

* Use the future format: 
  ```xml
  <viz-api-version>3.0</viz-api-version>
  ```

Save the file and restart Pentaho Server.

## Migrating visualization settings

* note that color palette in analyzer.properties is preserved

### Converting a general visualization property

* Show old `analyzer.properties` pattern
* Show future configuration system pattern

### Converting the special `maxValues` property

* Show current `analyzer.properties` pattern
* Show future configuration system pattern

### Correspondence between visualization ids

### Correspondence between property names and values
