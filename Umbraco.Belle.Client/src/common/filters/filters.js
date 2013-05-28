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
        }).
        filter('localize', function($log, localizationFactory) {
            return function(input) {
                $log.info(input, localizationFactory.getLabels()[input]);
                return localizationFactory.getLabels()[input];
            };
        });
