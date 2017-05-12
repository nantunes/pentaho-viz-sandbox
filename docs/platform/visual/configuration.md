# Configuration of javascript objects

The following is a simple example of a configuration rule that hides the pie chart (and any charts that derive from it) 
from the list of available visualizations:

```
  {
    select: {
      type: "pentaho/visual/models/pie"
    },
    apply: {
      isBrowsable: false
    }
  }
```

A configuration rule is an object that:
- must contain a mandatory `select` object, which restricts the span of objects targeted by this rule. 
This span can be specified by using the following attributes:
  + `type`: the identifier of the targeted AMD module (or list of module identifiers);
  + `application`:  the identifier of the targeted application (or list of applications), 
  e.g. `"pentaho-analyzer"` or `["pentaho-analyzer", "pentaho-det"]`;
  + `user`: the user name (or list of user names);
  + `theme`: the theme (or list of themes), e.g. (`"sapphire"` or `["crystal", "sapphire"]`);
  + `locale`: the locale
- must contain an `apply` object, which defines overrides for the properties of the targeted objects. 
You will need to consult the reference documentation for the list of available properties. 
- can contain a numeric `priority` (higher values have higher priority).

System administrators can readily add their own configuration rules by editing `config.js` files on predefined locations. 
- On PDI: `data-integration/system/karaf/config/web-config/config.js`
- On the Pentaho Server: `pentaho-solutions/system/karaf/config/web-config/config.js`

These files are shipped with a small set of illustrative (but commented-out) rules.
Please note that these files will be overwritten during upgrades.

## Deploying a configuration as a Pentaho Web Package 

A Pentaho Web Package is a convenient means to distribute user configurations.

### 1. Create a maven project that generates a Pentaho Web Package
 
Follow the [instructions for creating a Pentaho Web Package](pentaho-web-package) from a maven archetype.

### 2. Create the file with the configuration rules

Create a file `no-pie-charts.conf.js` under the folder `impl/src/main/resources/web` with the following content:

```
define(function(){
  
  // Define a rule
  var noPieCharts = {
    select: {
      type: "pentaho/visual/models/pie"
    },
    apply: {
      isBrowsable: false
    }
  };
    
  // return a list of rules
  return {
    rules: [ noPieCharts ];
  }
});
```


### 3. Register the rule set
Defining a file with a set of rules is not enough: 
you still need to inform the environment that you wish that file to be loaded.

Edit the file `impl/src/main/resources/META-INF/js/package.json` and
add an entry for the rule set file under the `config` section:

```
{
  ...
  "config": {
    "pentaho/service": {
       "no-pie-charts.conf": "pentaho.config.spec.IRuleSet"
    }
  },
  ...
};
```

This effectively declares that the file `no-pie-charts.conf.js` outputs a rule set.
When an application loads an environment, all the rule sets declared in the system are loaded and merged.


### 4. Build the project

On the root folder of the project, run
```
mvn clean package
```

### 5. Deploy the bundle

Copy the `.kar` file to the deploy locations:

- PDI: `data-integration/system/karaf/deploy`
- Pentaho Server: `pentaho-solutions/system/karaf/deploy`
