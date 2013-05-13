module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-testacular');
  grunt.loadNpmTasks('grunt-html2js');

  // Default task.
  grunt.registerTask('default', ['jshint','build','testacular:unit']);
  grunt.registerTask('build', ['clean','html2js','concat','recess:build','copy']);
  grunt.registerTask('release', ['clean','html2js','uglify','jshint','testacular:unit','concat:index', 'recess:min','copy','testacular:e2e']);
  grunt.registerTask('test-watch', ['testacular:watch']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  var testacularConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  // Project configuration.
  grunt.initConfig({
    distdir: 'belle',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    src: {
      js: ['src/**/*.js', '<%= distdir %>/templates/**/*.js'],
      common: ['src/common/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      html: ['src/index.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        common: ['src/common/**/*.tpl.html']
      },
      less: ['src/less/belle.less'] // recess:build doesn't accept ** in its file patterns
    },
    clean: ['<%= distdir %>/*'],
    copy: {
      assets: {
        files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' }]
      },
      vendor: {
        files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'vendor/' }]
      }
    },
    testacular: {
      unit: { options: testacularConfig('test/config/unit.js') },
      e2e: { options: testacularConfig('test/config/e2e.js') },
      watch: { options: testacularConfig('test/config/unit.js', { singleRun:false, autoWatch: true}) }
    },
    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= src.tpl.app %>'],
        dest: '<%= distdir %>/templates/app.js',
        module: 'templates.app'
      },
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= src.tpl.common %>'],
        dest: '<%= distdir %>/templates/common.js',
        module: 'templates.common'
      }
    },
    concat:{
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      index: {
        src: ['src/index.html'],
        dest: '<%= distdir %>/index.html',
        options: {
          process: true
        }
      },
      angular: {
        src:['vendor/angular/angular.min.js'],
        dest: '<%= distdir %>/lib/angular/angular.min.js'
      },
      controllers: {
        src:['src/app/**/*.js'],
        dest: '<%= distdir %>/js/umbraco.controllers.js',
        options:{
          banner: "'use strict';\ndefine([ 'app','angular'], function (app,angular) {\n",
          footer: "\n\nreturn app;\n});"
        }
      },
      services: {
        src:['src/common/services/*.js'],
        dest: '<%= distdir %>/js/umbraco.services.js',
        options:{
          banner: "'use strict';\ndefine([ 'app','angular'], function (app,angular) {\n",
          footer: "\n\nreturn app;\n});"
        }
      },
      resources: {
        src:['src/common/resources/*.js'],
        dest: '<%= distdir %>/js/umbraco.resources.js',
        options:{
          banner: "'use strict';\ndefine([ 'app','angular'], function (app,angular) {\n",
          footer: "\n\nreturn app;\n});"
        }
      },
      directives: {
        src:['src/common/directives/*.js'],
        dest: '<%= distdir %>/js/umbraco.directives.js',
        options:{
          banner: "'use strict';\ndefine([ 'app','angular'], function (app,angular) {\n",
          footer: "\n\nreturn app;\n});"
        }
      },
      filters: {
        src:['src/common/filters/*.js'],
        dest: '<%= distdir %>/js/umbraco.filters.js',
        options:{
          banner: "'use strict';\ndefine([ 'app','angular'], function (app,angular) {\n",
          footer: "\n\nreturn app;\n});"
        }
      }
    },
    uglify: {
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      angular: {
        src:['<%= concat.angular.src %>'],
        dest: '<%= distdir %>/angular.js'
      },
      jquery: {
        src:['vendor/jquery/*.js'],
        dest: '<%= distdir %>/jquery.js'
      }
    },
    recess: {
      build: {
        files: {
          '<%= distdir %>/<%= pkg.name %>.css':
          ['<%= src.less %>'] },
        options: {
          compile: true
        }
      },
      min: {
        files: {
          '<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
        },
        options: {
          compress: true
        }
      }
    },
    watch:{
      all: {
        files:['<%= src.common %>', '<%= src.specs %>', '<%= src.less =>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks:['default','timestamp']
      },
      build: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.less =>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks:['build','timestamp']
      }
    },
    jshint:{
      files:['gruntFile.js', '<%= src.common %>', '<%= src.specs %>', '<%= src.scenarios %>'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    }
  });

};
