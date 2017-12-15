/* vim: set noai ts=4 sw=4 expandtab eol nobinary: */

"use strict";

const express = require("express");

var app = express();

//Path to example application
app.use(express.static("./public/"));

//Path to openui5
app.use(express.static("./node_modules/openui5-dist/dist/"));

//Start web server
app.listen("3000", function() {
	console.log("Listening on port %d", "3000");
});

