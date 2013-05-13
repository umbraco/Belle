/*
 * grunt-testacular
 * http://github.com/Dignifiedquire/grunt-testacular
 *
 * Copyright (c) 2013 Friedel Ziegelmayer and contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Testacular libs.
  var testacular = require('testacular');

  grunt.registerMultiTask('testacularRun', 'Run tests on a testacular server. ', function() {
    // Make async.
    var done = this.async();

    var options = this.options({});

    // Run using testacular.runner
    testacular.runner.run(options, function(code) {
      done(code === 0);
    });

  });
};
