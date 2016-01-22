define(function() {
  "use strict";

  // datasets
  return [
    {
      model: [
        {name: "family", type: "string", label: "Family"},
        {name: "sales", type: "number", label: "Sales"}
      ],
      rows: [
        {c: [{v: "plains", f: "Plains"}, 123]},
        {c: [{v: "cars", f: "Cars"}, {v: 456}]}
      ]
    },
    {
      model: [
        {name: "brand", type: "string", label: "Brand"},
        {name: "sales", type: "number", label: "Sales"}
      ],
      rows: [
        {c: [{v: "pentaho", f: "Pentaho"}, 20]},
        {c: [{v: "toyota", f: "Toyota"}, {v: 30}]},
        {c: [{v: "mazda", f: "Mazda"}, {v: 40}]}
      ]
    }
  ];
});
