---
title: Packaging a visualization for deploy
description: Explains the core concepts and walks through the creation of a kar file for deploying a visualization in the Pentaho Platform.
parent-title: Visualization API
layout: default
---

The Pentaho platform is built on top of an OSGi container ([Apache Karaf](https://karaf.apache.org)). It allows a simple modular approach at both development time and runtime, reducing complexity and facilitating deployment.

A bundle is the deployment unit in OSGi. Basically, a bundle is just a JAR file with special bundle headers in the `META-INF/MANIFEST.MF` file.

Apache Karaf allows grouping bundles into [features](https://karaf.apache.org/manual/latest/provisioning#_feature_and_resolver). This facilitates the provisioning of the application, by automatically resolving and installing all bundles described in the feature.

Finally, Apache Karaf also provides a special type of artifact that packages the feature definition together with all the bundles described. This artifact is named a [KAR (KAraf aRchive)](https://karaf.apache.org/manual/latest/kar). Using a KAR file avoids the need to download artifacts from remote repositories.

Typically, to deploy your visualization you'll need a **bundle** with your code, a **feature** grouping it together with its dependencies, and a **KAR** file so you don't need to publish your bundle to a remote (or even local) repository and your dependencies are available without the need of a network connection.

To ease the process a Maven Archetype is provided that lays out for you the recommended project structure.

## Recommended Maven project directory layout

### Using the Archetype
```shell
mvn archetype:generate ...
```

>  - Maven project structure starting with the maven archetype. 
>    - _Do not inherit from pentaho parent POMs_
>    - _We need to check where/how to publish the archetype_

## Explain the folder structure

>  - Explain the folder structure
>    - What are the assemblies (generating kar) 
>    - What are the impl (the actual viz)
>      - ~Blueprint~ Keep it to a minimum. Just mentioned that this file is used to specify where (URL) the JS code will be available from

## Adding your dependencies

The client side dependencies your visualization uses, and that were declared in the `package.json` file, must also be provided to the platform as bundles.

But if they are third-party code that means you would have to bundle them yourself, creating separate modules, etc..

Luckily there is a project that already packages client side web libraries as JAR files. It is appropriately called [WebJars](http://www.webjars.org).

All you have to do is to look for the needed libraries (the [NPM flavor](http://www.webjars.org/npm) is recommended), choose the right versions and copy its Maven artifact information (groupId, artifactId and version).

If you can't find the library, or the right version, you can create a new WebJar (light blue button on the top right corner).

With the artifact information you can add the dependency to your feature definition. Just build the Maven artifact URL in the form `mvn:GROUP_ID/ARTIFACT_ID/VERSION`.

However, WebJars are just plain JAR files, without the manifest headers needed to make it a bundle. The Pentaho platform provides a Karaf deployer that resolves the problem: just prepend `pentaho-webjars:` to the artifact URL.

In the end the bundle description in the feature will look like this:
```xml
<bundle>pentaho-webjars:mvn:org.webjars.npm/whatwg-fetch/2.0.1</bundle>
```

You should add bundle description for each dependency declared in the `package.json` file. If using it, skip the VizAPI dependency, as it is provided by the platform.

## Building it

```shell
mvn package
```

...
