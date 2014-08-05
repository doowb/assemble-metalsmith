'use strict';

var path = require('path');
var _ = require('lodash');

/**
 * ## Adapter
 *
 * Exposes metalsmith like methods to let middleware/plugins work with Assemble
 */

function Adapter (assemble) {
  this.assemble = assemble;
}

Adapter.prototype.metadata = function(metadata) {
  if (!arguments.length) {
    return this.assemble.get();
  }
  this.assemble.set(metadata);
  return this;
};

Adapter.prototype.join = function() {
  var args = [].slice.call(arguments);
  args.unshift(this.assemble.get('base') || process.cwd());
  return path.join.apply(path, args);
};

Adapter.prototype.files = function(files) {
  if (!arguments.length) {
    // return the files in a format useful for metalsmith plugins
    files = {};
    this.assemble.files.forEach(function (file) {
      files[file.path] = _.extend({
        contents: file.contents
      }, file.data);
    });
    return files;
  }

  // convert the files from metalsmith to assemble
  _.forOwn(files, function (value, key) {
    var file = this.assemble.files.get(key);
    file.contents = value.contents;
    delete value.contents;
    file.data = _.extend(file.data || {}, value);
  }, this);

  return this;
};

module.exports = Adapter;