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

describe('metalsmithPlugin', function () {
  var instance = null;
  var metalsmithPlugin = null;

  beforeEach(function (done) {
    instance = assemble.create();
    metalsmithPlugin = plugin(instance);
    rimraf(outpath, done);
  });
  afterEach(function (done) {
    rimraf(outpath, done);
  });

  it('should return a stream', function (done) {
    var stream = metalsmithPlugin();
    should.exist(stream);
    should.exist(stream.on);
    done();
  });

  it('should run one middleware', function (done) {
    var called = 0;
    metalsmithPlugin
      .use(function (files, metalsmith, callback) {
        called++;
        _.forOwn(files, function (file) {
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
    outstream.on('end', function () {
      called.should.equal(1);
      instance.files.forEach(function (file) {
        /[ABCD]/.test(file.contents.toString()).should.be.true;
      });
      done();
    });

  });

  it('should run multiple middleware', function (done) {
    var called = 0;
    var middleware = function (files, metalsmith, callback) {
      called++;
      callback();
    };

    metalsmithPlugin
      .use(middleware)
      .use(middleware)
      .use(middleware)
      .use(middleware)
      .use(middleware);

    var instream = instance.src(path.join(__dirname, 'fixtures/templates/*.hbs'));
    var outstream = instance.dest(outpath);

    instream
      .pipe(metalsmithPlugin())
      .pipe(outstream);

    outstream.on('error', done);
    outstream.on('end', function () {
      called.should.equal(5);
      done();
    });

  });

});