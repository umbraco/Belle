<<<<<<< HEAD
/*! umbraco - v0.0.1-SNAPSHOT - 2013-05-24
=======
/*! umbraco - v0.0.1-SNAPSHOT - 2013-05-23
>>>>>>> dca5e28ed1d6651ab7122be31c5aa50509b0448f
 * http://umbraco.github.io/Belle
 * Copyright (c) 2013 Per Ploug, Anders Stenteberg & Shannon Deminick;
 * Licensed MIT
 */
'use strict';
define([ 'app','angular'], function (app,angular) {
angular.module('umbraco.filters', [])
        .filter('interpolate', ['version', function(version) {
            return function(text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            };
        }])
        .filter('propertyEditor', function() {
            return function(input) {
                return "views/propertyeditors/" + String(input).replace('.', '/') + "/editor.html";
            };
        });


return app;
});