var app = angular.module('umbraco', [
  	'umbraco.filters',
  	'umbraco.directives',
  	'umbraco.resources.content',
  	'umbraco.resources.contentType',
  	'umbraco.resources.macro',
  	'umbraco.resources.media',
  	'umbraco.resources.template',
  	'umbraco.resources.user',
  	'umbraco.services.section',
    'umbraco.services.notifications',
  	'umbraco.services.tree',
  	'umbraco.services.dialog',
  	'umbraco.services.search'
    ]);