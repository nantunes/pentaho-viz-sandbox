#!/usr/bin/env node
"use strict";

var path = require("path");
var nstatic = require("node-static");
var http = require("http");

var cors = {
  headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Headers": "Content-Type"
  },
  cache: false
};

var sandbox_path = __dirname + "/ui";
var sandbox_server = new nstatic.Server(sandbox_path, cors);

var api_path = path.dirname(require.resolve("pentaho-viz-api"));
var api_server = new nstatic.Server(api_path, cors);

var commonui_path = path.dirname(require.resolve("common-ui/package.json"));
var commonui_server = new nstatic.Server(commonui_path + "/package-res", cors);

var viz_server = new nstatic.Server(process.env.PWD, cors);

http.createServer(function (request, response) {
  request.addListener("end", function () {
    var url = request.url;
    var server = null;

    if(url === "/" || url === "/index.html") {
      response.writeHead(301, {
        "Location": "/sandbox/"
      });

      response.end();

      return;
    } else if(url === "/package.json") {
      server = viz_server;
    } else if(url.startsWith("/sandbox")) {
      server = sandbox_server;
      url = url.substring(8);
    } else if(url.startsWith("/viz-api")) {
      server = api_server;
      url = url.substring(8);
    } else if(url.startsWith("/content/common-ui")) {
      server = commonui_server;
      url = url.substring(18);
    } else if(url.startsWith("/dev")) {
      server = viz_server;
      url = url.substring(4);
    } else {
      server = viz_server;
    }

    if(url.length === 0) {
      response.writeHead(301, {
        "Location": request.url + "/"
      });

      response.end();

      return;
    }

    request.url = url;
    server.serve(request, response);
  }).resume();
}).listen(8080);


var open_browser = require("open");
open_browser("http://localhost:8080/");
