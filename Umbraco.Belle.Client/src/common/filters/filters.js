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
