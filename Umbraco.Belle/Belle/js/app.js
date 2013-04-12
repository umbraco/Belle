'use strict';
define(['angular'], function (angular) {
  return angular.module('umbraco', ['umbraco.filters', 'umbraco.directives', 'stateManager']);
});


/*
'use strict';
// Declare app level module which depends on filters, directives and services
var umbracoApp = angular.module('umbraco', ['umbraco.filters', 'umbraco.services', 'umbraco.directives', 'stateManager']);
umbracoApp.config(function ($routeProvider) {
    $routeProvider
        .when('/:section', {
            templateUrl: "views/application/dashboard.html"
        })
        .when('/:section/:method', {
            templateUrl: function(rp) {
                if (!rp.method)
                    return "views/application/dashboard.html";
                
                return 'views/' + rp.section + '/' + rp.method + '.html';
            }
        })
        .when('/:section/:method/:id', {
            templateUrl: function(rp) {
                if (!rp.method) 
                    return "views/application/dashboard.html";
                
                return 'views/' + rp.section + '/' + rp.method + '.html';
            }
        })
        .otherwise({ redirectTo: '/content' });
}).config(function ($locationProvider) {
    //$locationProvider.html5Mode(false).hashPrefix('!');	//turn html5 mode off
    // $locationProvider.html5Mode(true);					//turn html5 mode on
});;
*/
