'use strict';

var path = require('path');

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
  // TODO: make sure Assemble has destBase
  // args.unshift(this.assemble.get('destBase'));
  return path.join.apply(path, args);
};

Adapter.prototype.files = function(files) {
  if (!arguments.length) {
    // TODO: convert files array into metalsmith type array
    return this.assemble.files.toArray();
  }
  // TODO: set the files back on assemble.files
  return this;
};

module.exports = Adapter;