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
define(['angular'], function (angular) {
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

return app;
});