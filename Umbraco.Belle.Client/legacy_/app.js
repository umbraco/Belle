'use strict';
define(['angular'], function (angular) {

  return angular.module('umbraco', [
  	'umb.filters', 
  	'umb.directives',
  	'umb.resources.content',
  	'umb.resources.contentType',
  	'umb.resources.macro',
  	'umb.resources.media',
  	'umb.resources.template',
  	'umb.resources.user',
  	'umb.services.section',
    'umb.services.notifications',
  	'umb.services.tree',
  	'umb.services.dialog',
  	'umb.services.search'
  ]);

});