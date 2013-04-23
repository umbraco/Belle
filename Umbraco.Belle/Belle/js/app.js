'use strict';
define(['angular'], function (angular) {
  return angular.module('umbraco', ['umbraco.filters', 'umbraco.directives', 'umbraco.ui.services','stateManager']);
});