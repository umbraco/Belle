'use strict';

/* Filters */

define([ 'angular'], function (angular) {

return angular.module('umbraco.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);

});
