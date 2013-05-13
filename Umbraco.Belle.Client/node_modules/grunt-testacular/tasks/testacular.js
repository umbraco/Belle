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

  grunt.registerMultiTask('testacular', 'Starts up a testacular server.', function() {

    // Make async.
    var done = this.async();

    var options = this.options({
      keepalive: false
    });

    // Start Testacular server.
    testacular.server.start(options, function(code) {
      done(code === 0);
    });

    // Running the task explicitly as grunt:keepalive will override any
    // value stored in the config.
    // If keepalive is not set we are finished so other tasks can do their
    // work.
    if (! (this.flags.keepalive || options.keepalive)) {
      done();
    }
  });
};
