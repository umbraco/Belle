/*! umbraco - v0.0.1-SNAPSHOT - 2013-06-04
 * http://umbraco.github.io/Belle
 * Copyright (c) 2013 Per Ploug, Anders Stenteberg & Shannon Deminick;
 * Licensed MIT
 */
'use strict';
define([ 'app','angular'], function (app,angular) {

    /**
    * @ngdoc filter 
    * @name umbraco.filters:propertyEditor
    * @description This will ensure that the view for the property editor is rendered correctly, meaning it will check for an absolute path, otherwise load it in the normal umbraco path
    **/
    function propertyEditorFilter($log) {
        return function (input) {
            //if its not defined then return undefined
            if (!input) return input;

			//Added logging here because this fires a ton of times and not sure that it should be!
            //$log.info("Filtering property editor view: " + input);

            var path = String(input);
            if (path.startsWith('/')) {
                return path;
            }
            else {
                return "views/propertyeditors/" + path.replace('.', '/') + "/editor.html";
            }            
        };
    }

angular.module('umbraco.filters', [])
        .filter('interpolate', ['version', function(version) {
            return function(text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            };
        }])
        .filter('propertyEditor', propertyEditorFilter);


return app;
});