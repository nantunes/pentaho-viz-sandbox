/*!
 * Copyright 2010 - 2017 Pentaho Corporation. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
  "module",
  "pentaho/visual/base/view",
  "./model",
  "d3"
], function(module, baseViewFactory, barModelFactory, d3) {

  "use strict";

  // Return the View factory function.
  return function(context) {

    // Obtain the base View class from the context, given the base View's factory function.
    var BaseView = context.get(baseViewFactory);

    // Create the Bar View subclass
    var BarView = BaseView.extend({
      type: {
        id: module.id,
        props: [
          // Specialize the inherited model property to the Bar model type
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
