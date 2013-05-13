'use strict';
define([ 'app','angular'], function (app,angular) {
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
  	'umb.services.notifications',
  	'umb.services.tree',
  	'umb.services.dialog',
  	'umb.services.search'
    ]);

});

//used for the media picker dialog
app.controller("mediaPickerDialogController", function ($scope, mediaFactory) {	
	$scope.images = mediaFactory.rootMedia();
});
app.controller("contentCreateController", function ($scope, $routeParams,contentTypeFactory) {	
	$scope.allowedTypes  = contentTypeFactory.allowedTypes($scope.currentNode.id);	
});
app.controller("contentEditController", function ($scope, $routeParams, contentFactory, notifications) {

	if($routeParams.create)
		$scope.content = contentFactory.getContentScaffold($routeParams.parentId, $routeParams.doctype);
	else
		$scope.content = contentFactory.getContent($routeParams.id);


	$scope.saveAndPublish = function (cnt) {
		cnt.publishDate = new Date();
		contentFactory.publishContent(cnt);

		notifications.success(cnt.name + " published", "");
	};

	$scope.save = function (cnt) {
		cnt.updateDate = new Date();
		contentFactory.saveContent(cnt);

		notifications.success(cnt.name + " saved", "");
	};
	
});
require.config({
  waitSeconds: 120,
  paths: {
    jquery: '../lib/jquery/jquery-1.8.2.min',
    jqueryCookie: '../lib/jquery/jquery.cookie',
    bootstrap: '../lib/bootstrap/js/bootstrap',
    underscore: '../lib/underscore/underscore',
    angular: '../lib/angular/angular.min',
    angularResource: '../lib/angular/angular-resource',
    
    codemirror: '../lib/codemirror/js/lib/codemirror',
    codemirrorJs: '../lib/codemirror/js/mode/javascript/javascript',
    codemirrorCss: '../lib/codemirror/js/mode/css/css',
    codemirrorXml: '../lib/codemirror/js/mode/xml/xml',
    codemirrorHtml: '../lib/codemirror/js/mode/htmlmixed/htmlmixed',

    tinymce: '../lib/tinymce/tinymce.min',
    text: '../lib/require/text',
    async: '../lib/require/async',
    css: '../lib/require/css'
  },
  shim: {
    'angular' : {'exports' : 'angular'},
    'angular-resource': { deps: ['angular'] },
    'bootstrap': { deps: ['jquery'] },
    'jqueryCookie': { deps: ['jquery'] },
    'underscore': {exports: '_'},
    'codemirror': {exports: 'CodeMirror'},  
    'codemirrorJs':{deps:['codemirror']},
    'codemirrorCss':{deps:['codemirror']},
    'codemirrorXml':{deps:['codemirror']},
    'codemirrorHtml':{deps:['codemirrorXml','codemirrorCss','codemirrorJs'], exports: 'mixedMode'},
    'tinymce': {
      exports: 'tinyMCE',
      init: function () {
        this.tinymce.DOM.events.domLoaded = true;
        return this.tinymce;
      }
    }
  },
  priority: [
  "angular"
  ],
  urlArgs: 'v=1.1'
});

require( [
  'angular',
  'app',
  'jquery',
  'jqueryCookie',
  'bootstrap',
  'services/services',
  'services/ui.services',
  'controllers/application',
  'controllers/dialogs',
  'controllers/editors',
  'controllers/propertyeditor',
  'filters/filters',
  'directives/directives',
  'routes'
  ], function(angular, app) {
  //This function will be called when all the dependencies
  //listed above are loaded. Note that this function could
  //be called before the page is loaded.
  //This callback is optional.

  jQuery(document).ready(function () {
    angular.bootstrap(document, ['umbraco']);
  });
});

'use strict';

define(['app'], function (app) {

app.controller("CodeMirrorController", function ($scope, $rootScope) {
    require(
        [
            'css!../lib/codemirror/js/lib/codemirror.css',
            'css!../lib/codemirror/css/umbracoCustom.css',
            'codemirrorHtml'
        ],
        function () {

            var editor = CodeMirror.fromTextArea(
                                    document.getElementById($scope.property.alias), 
                                    {
                                        mode: CodeMirror.modes.htmlmixed, 
                                        tabMode: "indent"
                                    });

            editor.on("change", function(cm) {
                $rootScope.$apply(function(){
                    $scope.property.value = cm.getValue();   
                });
            });

        });
});

	return app;
});


'use strict';

define(['app'], function (app) {
    app.controller("GoogleMapsController", function ($rootScope, $scope, $notification) {
    require(
        [
            'async!http://maps.google.com/maps/api/js?sensor=false'
        ],
        function () {
            //Google maps is available and all components are ready to use.
            var valueArray = $scope.property.value.split(',');
            var latLng = new google.maps.LatLng(valueArray[0], valueArray[1]);
            
            var mapDiv = document.getElementById($scope.property.alias + '_map');
            var mapOptions = {
                zoom: $scope.property.config.zoom,
                center: latLng,
                mapTypeId: google.maps.MapTypeId[$scope.property.config.mapType]
            };

            var map = new google.maps.Map(mapDiv, mapOptions);
            var marker = new google.maps.Marker({
                map: map,
                position: latLng,
                draggable: true
            });
            
            google.maps.event.addListener(marker, "dragend", function(e){
                var newLat = marker.getPosition().lat();
                var newLng = marker.getPosition().lng();
            
                //here we will set the value
                $scope.property.value = newLat + "," + newLng;

                //call the notication engine
                $rootScope.$apply(function () {
                    $notification.warning("Your dragged a marker to", $scope.property.value);
                });
            });
        }
    );    
});



	return app;
});


'use strict';

define(['app'], function (app) {

//this controller simply tells the dialogs service to open a mediaPicker window
//with a specified callback, this callback will receive an object with a selection on it
app.controller("GridController", function($rootScope, $scope, $dialog, $log){
    //we most likely will need some iframe-motherpage interop here
    $log.log("loaded");

    $scope.openMediaPicker =function(){
            var dialog = $dialog.mediaPicker({scope: $scope, callback: populate});
    };

    function populate(data){
        //notify iframe to render something.. 
    }

    $(window).bind("umbraco.grid.click", function(event) {
        $scope.$apply(function() {
            $scope.openMediaPicker();
        });
    });
});

	return app;
});



$(function(){
    var editors = $('[data-editor]');
    var p = parent.$(parent.document);


    editors.addClass("editor");

    editors.on("click", function (event) {
        event.preventDefault();

      //  parent.document.fire("umbraco.grid.click");
      	var el = this;
      	var e = jQuery.Event("umbraco.grid.click", {editor: $(el).data("editor"), element: el});
        p.trigger( e );
    });
});




'use strict';

define(['app'], function (app) {

    //this controller simply tells the dialogs service to open a mediaPicker window
    //with a specified callback, this callback will receive an object with a selection on it
    app.controller("mediaPickerController", function($rootScope, $scope, $dialog){
        $scope.openMediaPicker =function(value){
                var dialog = $dialog.mediaPicker({scope: $scope, callback: populate});
        };

        function populate(data){
            $scope.property.value = data.selection;    
        }
    });

	return app;
});


define([
  'app'
  ], function(app) {

    return app.config(function ($routeProvider) {
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
    //$locationProvider.html5Mode(false).hashPrefix('!'); //turn html5 mode off
    // $locationProvider.html5Mode(true);         //turn html5 mode on
});

});


return app;
});