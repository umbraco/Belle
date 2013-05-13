/*
 * grunt-testacular
 * http://github.com/Dignifiedquire/grunt-testacular
 *
 * Copyright (c) 2013 Friedel Ziegelmayer and contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    testacular: {
      async: {
        options: {
          configFile: 'test/testacular.conf.js',
          keepalive: true
        }
      },
      sync: {
        options: {
          configFile: 'test/testacular.conf.js'
        }
      }
    },
    testacularRun: {
      async: {
        options: {
          runnerPort: 9101
        }
      }
    }
  });


  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', 'jshint');
};