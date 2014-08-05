/**
 * Copyright (c) 2014, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var _ = require('lodash');
var path = require('path');
var assert = require('assert');
var should = require('should');
var rimraf = require('rimraf');
var assemble = require('assemble');

var plugin = require('..');
var outpath = path.join(__dirname, './out-fixtures');
var srcpath = path.join(__dirname, 'fixtures', 'templates');

describe('metalsmithPlugin', function() {
  var instance = null;
  var metalsmithPlugin = null;

  beforeEach(function(done) {
    instance = assemble.create();
    metalsmithPlugin = plugin(instance);
    rimraf(outpath, done);
  });
  afterEach(function(done) {
    rimraf(outpath, done);
  });

  it('should get files as an object', function(done) {
    metalsmithPlugin
      .use(function(files, metalsmith, callback) {
        files.should.have.a.property(path.join(srcpath, 'a.hbs'));
        files.should.have.a.property(path.join(srcpath, 'b.hbs'));
        files.should.have.a.property(path.join(srcpath, 'c.hbs'));
        files.should.have.a.property(path.join(srcpath, 'd.hbs'));

        _.forOwn(files, function(file) {
          file.title = (file.title || '').toUpperCase();
        });
        callback();
      });

    var instream = instance.src(path.join(__dirname, 'fixtures/templates/*.hbs'));
    var outstream = instance.dest(outpath);

    instream
      .pipe(metalsmithPlugin())
      .pipe(outstream);

    outstream.on('error', done);
    outstream.on('end', function() {
      instance.files.forEach(function(file) {
        /[ABCD]/.test(file.contents.toString()).should.be.true;
      });
      done();
    });

  });

});