'use strict';

/*
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var Ware = require('ware');

var Adapter = require('./lib/adapter');

module.exports = function (assemble) {

  var ware = new Ware();

  /**
  * ## Machinist plugin
  *
  * Assemble plugin to run metalsmith middleware
  */

  function machinistPlugin() {
    return through.obj(function (file, encoding, callback) {
      return callback();
    }, function (callback) {

      // keep a reference to the stream
      var stream = this;

      // initialize an adapter for metalsmith
      var adapter = new Adapter(assemble);

      // run all the registered middleware
      ware.run(adapter.files(), adapter, function (err, files) {
        if (err) {
          stream.emit('error', new gutil.PluginError('assemble-machinist', err));
          return callback();
        }

        // restore the files and push them through the stream
        adapter.files(files);
        assemble.files.forEach(function (file) {
          stream.push(file);
        });
        return callback();
      })

    });
  };


  /**
   * ## .use
   *
   * Add a middleware or plugin to use.
   * 
   * @param  {Function} `middleware` this is the middleware to run.
   * @return {Object} this for chaining
   */
  
  machinistPlugin.use = function (middleware) {
    ware.use(middleware);
    return this;
  };

  return machinistPlugin;
};