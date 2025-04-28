"use strict";

const build = require("@microsoft/sp-build-web");
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const path = require("path");

build.addSuppression();

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);
  result.set("serve", result.get("serve-deprecated"));
  return result;
};

// Initialize the SP build
build.initialize(gulp);
