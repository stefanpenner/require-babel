'use strict';
var fs = require('fs');
var path = require('path');

var babel = require('babel-core');
var Module = require('module');

module.exports = function requireBabel(filename, parent) {
  var resolved = Module._resolveFilename(filename, parent);

  var cached = Module._cache[resolved];

  if (cached) {
    return cached.exports;
  }

  var content = fs.readFileSync(resolved, 'utf8').toString();

  var compiled = babel.transform(content);
  var module = new Module(resolved, parent);

  Module._cache[resolved] = module;

  module.filename = resolved;
  module.paths = Module._nodeModulePaths(path.dirname(filename));
  module._compile(compiled.code, filename);
  module.loaded = true;
  return module.exports;
};

