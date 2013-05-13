/*! umbraco - v0.0.1-SNAPSHOT - 2013-05-13
 * http://umbraco.github.io/Belle
 * Copyright (c) 2013 Per Ploug, Anders Stenteberg & Shannon Deminick;
 * Licensed MIT
 */
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

angular.module('umb.directives', [])
    .directive('val-regex', function () {

        /// <summary>
        ///     A custom directive to allow for matching a value against a regex string.
        ///     NOTE: there's already an ng-pattern but this requires that a regex expression is set, not a regex string
        ///</summary>

        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {

                var regex = new RegExp(scope.$eval(attrs.valRegex));

                ctrl.$parsers.unshift(function (viewValue) {
                    if (regex.test(viewValue)) {
                        // it is valid
                        ctrl.$setValidity('val-regex', true);
                        return viewValue;
                    }
                    else {
                        // it is invalid, return undefined (no model update)
                        ctrl.$setValidity('val-regex', false);
                        return undefined;
                    }
                });
            }
        };
    })

    .directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])

    .directive('preventDefault', function () {
        return function (scope, element, attrs) {
            $(element).click(function (event) {
                event.preventDefault();
            });
        };
    })

    .directive('autoScale', function ($window) {
        return function (scope, el, attrs) {

            var totalOffset = 0;
            var offsety = parseInt(attrs.autoScale);
            var window = angular.element($window);
            if (offsety != undefined)
                totalOffset += offsety;

            setTimeout(function () {
                el.height(window.height() - (el.offset().top + totalOffset));
            }, 300);

            window.bind("resize", function () {
                el.height(window.height() - (el.offset().top + totalOffset));
            });

        };
    })


    .directive('headline', function ($window) {
        return function (scope, el, attrs) {

            var h1 = $("<h1 class='umb-headline-editor'></h1>").hide();
            el.parent().prepend(h1);
            el.addClass("umb-headline-editor");

            if (el.val() != '') {
                el.hide();
                h1.text(el.val());
                h1.show();
            } else {
                el.focus();
            }

            el.on("blur", function () {
                el.hide();
                h1.html(el.val() + "<i class='icon icon-pencil'></i>").show();
            });

            h1.on("click", function () {
                h1.hide();
                el.show().focus();
            });
        };
    })


    .directive('onKeyup', function () {
        return function (scope, elm, attrs) {
            elm.bind("keyup", function () {

                scope.$apply(attrs.onKeyup);
            });
        };
    })


    .directive('requireController', function ($parse) {
        return function (scope, elm, attrs) {
            var path = scope.$eval(attrs.requireController);

            if (path != undefined && path != "") {
                path = "views/propertyeditors/" + path.replace('.', '/') + "/controller.js";
                require([path]);
            }

            //scope.$apply(attrs.requireController);
        };
    })


    .directive('propertyEditor', function () {
        return {
            restrict: 'A',
            template: '<div class="controls controls-row" ng-include="editorView"></div>',
            //templateUrl: '/partials/template.html',
            link: function (scope, iterStartElement, attr) {

                var property = scope.$eval(attr.propertyEditor);
                var path = property.controller;
                var editor = "views/propertyeditors/" + property.view.replace('.', '/') + "/editor.html";

                if (path != undefined && path != "") {
                    path = "views/propertyeditors/" + path.replace('.', '/') + "/controller.js";
                    require([path], function () {
                        scope.editorView = editor;
                    });
                } else {
                    scope.editorView = editor;
                }


            }
        };
    })


    .directive('onKeyDown', function ($key) {
        return {
            link: function (scope, elm, attrs) {
                $key('keydown', scope, elm, attrs);
            }
        };
    })


    .directive('onBlur', function () {
        return function (scope, elm, attrs) {
            elm.bind("blur", function () {
                scope.$apply(attrs.onBlur);
            });
        };
    })

    .directive('onFocus', function () {
        return function (scope, elm, attrs) {
            elm.bind("focus", function () {
                scope.$apply(attrs.onFocus);
            });
        };
    });


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

angular.module('umb.resources.content', [])
.factory('contentFactory', function () {
    
    var contentArray = [];

    return {
        getContent: function (id) {

            if (contentArray[id] !== undefined){
                return contentArray[id];
            }

            var content = {
                name: "My content with id: " + id,
                updateDate: new Date(),
                publishDate: new Date(),
                id: id,
                parentId: 1234,
                tabs: [
                {
                    label: "Tab 0",
                    alias: "tab00",
                    properties: [
                    { alias: "list", label: "List", view: "umbraco.listview", value: "", hideLabel: true }
                    ]
                },
                {
                    label: "Tab 1",
                    alias: "tab01",
                    properties: [
                    { alias: "bodyText", label: "Body Text", description:"Here you enter the primary article contents", view: "umbraco.rte", value: "<p>askjdkasj lasjd</p>" },
                    { alias: "textarea", label: "textarea", view: "umbraco.textarea", value: "ajsdka sdjkds", config: { rows: 4 } },
                    { alias: "map", label: "Map", view: "umbraco.googlemaps", controller: "umbraco.googlemaps", value: "37.4419,-122.1419", config: { mapType: "ROADMAP", zoom: 4 } },
                    { alias: "upload", label: "Upload file", view: "umbraco.fileupload", value: "" },
                    { alias: "media", label: "Media picker", view: "umbraco.mediapicker", controller: "umbraco.mediapicker", value: "" }
                    ]
                },
                {
                    label: "Tab 2",
                    alias: "tab02",
                    properties: [
                    { alias: "metaText", label: "Meta Text", view: "umbraco.rte", value: "<p>askjdkasj lasjd</p>" },
                    { alias: "textarea", label: "Description", view: "umbraco.textarea", value: "ajsdka sdjkds", config: { rows: 7 } },
                    { alias: "dropdown", label: "Keywords", view: "umbraco.dropdown", value: "aksjdkasjdkj" },
                    { alias: "upload", label: "Upload file", view: "umbraco.fileupload", value: "" },
                    { alias: "code", label: "Codemirror", view: "umbraco.code", controller: "umbraco.code", value: "test" }
                    ]
                },
                {
                    label: "Grid",
                    alias: "tab03",
                    properties: [
                    { alias: "grid", label: "Grid", view: "umbraco.grid", controller: "umbraco.grid", value: "test", hideLabel: true }
                    ]
                }
                ]
            };

            return content;
        },

        //returns an empty content object which can be persistent on the content service
        //requires the parent id and the alias of the content type to base the scaffold on
        getContentScaffold: function(parentId, alias){

            //use temp storage for now...

            var c = this.getContent(parentId);
            c.name = "empty name";
            
            $.each(c.tabs, function(index, tab){
                $.each(tab.properties,function(index, property){
                    property.value = "";
                });
            });

            return c;
        },

        //saves or updates a content object
        saveContent: function (content) {
            contentArray[content.id] = content;
            //alert("Saved: " + JSON.stringify(content));
        },

        publishContent: function (content) {
            contentArray[content.id] = content;
        }

    };
});
angular.module('umb.resources.contentType', [])
.factory('contentTypeFactory', function () {
    return {

        //return all availabel types
        all: function(){
            return [];
        },

        //return children inheriting a given type
        children: function(id){
            return [];
        },

        //return all content types a type inherite from
        parents: function(id){
            return [];
        },

        //return all types allowed under given document
        allowedTypes: function(documentId){
          return [
          {name: "News Article", description: "Standard news article", alias: "newsArticle", id: 1234, cssClass:"file"},
          {name: "News Area", description: "Area to hold all news articles, there should be only one", alias: "newsArea", id: 1234, cssClass:"suitcase"},
          {name: "Employee", description: "Employee profile information page",  alias: "employee", id: 1234, cssClass:"user"}
          ];
      }
  };
});
angular.module('umb.resources.macro', [])
.factory('macroFactory', function () {
    
    return {

        //returns a list of all available macros
        //if a boolean is passed it will restrict the list 
        //to macros allowed in the RTE
        all: function(restrictToEditorMacros){
          return[
              {name: "News List", description: "Standard news article", alias: "newsList"},
              {name: "Gallery", description: "Area to hold all news articles, there should be only one", alias: "gallery"},
              {name: "Employee", description: "Employee profile information page",  alias: "employee"}
          ];
        },

        //gets the complete macro with all properties
        getMacro: function(macroAlias){
           return{
                name: "News List",
                alias: "newsList",
                render: true,
                useInEditor: true,
                properties:[
                    {label: "Body Text", alias: "body", view: "umbraco.rte"},
                    {label: "Media Picker", alias: "nodeId", view: "umbraco.mediapicker"},
                    {label: "string", alias: "str", view: "umbraco.textstring"}
                ]
            };
        },

        //calls the server to render the macro and return the HTML
        //a <umbraco:macro> element or a macro json object can be passed
        renderMacro: function(macro, pageId){
            var html = $("<div><h1> BOOM: " + macro.name + "</h1></div>");
            var list = $("<ul></ul>");

            $.each(macro.properties, function(i, prop){
                list.append("<li>" + prop.label + ":" + prop.value + "</li>");
            });

            return html.append(list)[0].outerHTML;
        }
    };
});
angular.module('umb.resources.media', [])
.factory('mediaFactory', function () {
    var mediaArray = [];
    return {
        rootMedia: function(){
          return [
          {id: 1234, src: "/Media/boston.jpg", thumbnail: "/Media/boston.jpg" },
          {src: "/Media/bird.jpg", thumbnail: "/Media/bird.jpg" },
          {src: "/Media/frog.jpg", thumbnail: "/Media/frog.jpg" }
          ];
      }
  };
});
angular.module('umb.resources.template', [])
.factory('templateFactory', function () {
	return {
		getTemplate: function (id) {
			var t = {
				name: "Master",
				id: id,
				path: "/Views/master.cshtml",
				parent: "",
				content: "<p>Hello</p>"
			};

			return t;
		},
		storeTemplate: function (template) {

		},
		deleteTemplate: function (id) {

		}
	};
});
angular.module('umb.resources.user', [])
.factory('userFactory', function () {

    var mediaArray = [];
    
    return {
        rootMedia: function(){
          return [
          {id: 1234, src: "/Media/boston.jpg", thumbnail: "/Media/boston.jpg" },
          {src: "/Media/bird.jpg", thumbnail: "/Media/bird.jpg" },
          {src: "/Media/frog.jpg", thumbnail: "/Media/frog.jpg" }
          ];
      }
  };
});

angular.module('umb.services.dialog', [])
.factory('dialog', ['$rootScope', '$compile', '$http', '$timeout', '$q', '$templateCache', function($rootScope, $compile, $http, $timeout, $q, $templateCache) {
	
	function _open(options){	
		if(!options){
			options = {};
		}

		var scope = options.scope || $rootScope.$new(),
		templateUrl = options.template;
		
		var callback = options.callback;
		return $q.when($templateCache.get(templateUrl) || $http.get(templateUrl, {cache: true}).then(function(res) { return res.data; }))
		.then(function onSuccess(template) {

					// Build modal object
					var id = templateUrl.replace('.html', '').replace(/[\/|\.|:]/g, "-") + '-' + scope.$id;
					var $modal = $('<div class="modal umb-modal hide" tabindex="-1"></div>').attr('id', id).addClass('fade').html(template);

					if(options.modalClass){ 
						$modal.addClass(options.modalClass);
					}
							
					$('body').append($modal);

					// Compile modal content
					$timeout(function() {
						$compile($modal)(scope);
					});

					scope.dialogData = {};
					scope.dialogData.selection = [];

					// Provide scope display functions
					scope.$modal = function(name) {
						$modal.modal(name);
					};
					
					scope.hide = function() {
						$modal.modal('hide');
					};

					scope.show = function() {
						$modal.modal('show');
					};

					scope.submit = function(data){
						callback(data);
						$modal.modal('hide');
					};

					scope.select = function(item){
						if(scope.dialogData.selection.indexOf(item) < 0){
							scope.dialogData.selection.push(item);	
						}	
					};

					scope.dismiss = scope.hide;

					// Emit modal events
					angular.forEach(['show', 'shown', 'hide', 'hidden'], function(name) {
						$modal.on(name, function(ev) {
							scope.$emit('modal-' + name, ev);
						});
					});

					// Support autofocus attribute
					$modal.on('shown', function(event) {
						$('input[autofocus]', $modal).first().trigger('focus');
					});

					//Autoshow	
					if(options.show) {
						$modal.modal('show');
					}

					//Return the modal object	
					return $modal;
				});	
}

return{
	open: function(options){
		return _open(options);
	},
	mediaPicker: function(options){
		return _open({
			scope: options.scope, 
			callback: options.callback, 
			template: 'app/common/dialogs/mediaPicker.html', 
			show: true, backdrop: 'static'});
	},
	contentPicker: function(options){
		return _open({
			scope: options.scope, 
			callback: options.callback, 
			template: 'app/common/dialogs/contentPicker.html', 
			show: true, backdrop: 'static'});
	},
	macroPicker: function(options){
		return _open({
			scope: options.scope, 
			callback: options.callback, 
			template: 'app/common/dialogs/macroPicker.html', 
			show: true, backdrop: 'static'});
	},
	propertyDialog: function(options){
		return _open({
			scope: options.scope, 
			callback: options.callback, 
			template: 'app/common/dialogs/property.html', 
			show: true, backdrop: 'static'});
	},
	append : function(options){
		var scope = options.scope || $rootScope.$new(), 
		templateUrl = options.template;

		return $q.when($templateCache.get(templateUrl) || $http.get(templateUrl, {cache: true}).then(function(res) { return res.data; }))
		.then(function onSuccess(template) {

						// Compile modal content
						$timeout(function() {
							options.container.html(template);
							$compile(options.container)(scope);
						});

						return template;
					});
	}  
};
}]);	
angular.module('umb.services.notifications', [])
.factory('notifications', function ($rootScope) {

	var nArray = [];

	function add(item) {
		var index = nArray.length;
		nArray.push(item);

		setTimeout(function () {
			$rootScope.$apply(function() {
				nArray.splice(index, 1);
			});
			
		}, 5000);

		return nArray[index];
	}

	return {
		success: function (headline, message) {
			return add({ headline: headline, message: message, type: 'success', time: new Date() });
		},
		error: function (headline, message) {
			return add({ headline: headline, message: message, type: 'error', time: new Date() });
		},
		warning: function (headline, message) {
			return add({ headline: headline, message: message, type: 'warning', time: new Date() });
		},
		remove: function (index) {
			nArray.splice(index, 1);
		},
		removeAll: function () {
			nArray = [];
		},

		current: nArray,

		getCurrent: function(){
			return nArray;
		}
	};
});
angular.module('umb.services.search', [])
.factory('search', function () {
	return {
		search: function(term, section){

			return [
			{
				section: "settings",
				tree: "documentTypes",
				matches:[
				{ name: "News archive", path:"/News Archive", id: 1234, icon: "icon-list-alt", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
				{ name: "Meta Data", path:"/Seo/Meta Data", id: 1234, icon: "icon-list-alt", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
				{ name: "Dooo", path:"/Woop/dee/dooo", id: 1234, icon: "icon-list-alt red", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 }
				
				]	
			},
			{
				section: "content",
				tree: "content",
				matches:[
				{ name: "News", path:"/archive/news", id: 1234, icon: "icon-file", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
				{ name: "Data types", path:"/Something/About/Data-Types", id: 1234, icon: "icon-file", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
				{ name: "Dooo", path:"/Woop/dee/dooo", id: 1234, icon: "icon-file", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 }
				]	
			},

			{
				section: "developer",
				tree: "macros",
				matches:[
				{ name: "Navigation", path:"/Macros/Navigation.xslt", id: 1234, icon: "icon-cogs", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
				{ name: "List of stuff", path:"/Macros/Navigation.xslt", id: 1234, icon: "icon-cogs", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
				{ name: "Something else", path:"/Macros/Navigation.xslt",id: 1234, icon: "icon-cogs", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 }
				]	
			}
			];	
		},
		
		setCurrent: function(sectionAlias){
			currentSection = sectionAlias;	
		}
	};
});
angular.module('umb.services.tree', [])
.factory('tree', function ($section) {
		//implement this in local storage
		var treeArray = [];
		var currentSection = "content";

		return {
			getTree: function (section) {
				if (treeArray[section] !== undefined){
					return treeArray[section];
				}
			
				var t;
				switch(section){
					case "developer":
					t = {
						name: section,
						alias: section,

						children: [
						{ name: "Data types", id: 1234, icon: "icon-folder-close", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
						{ name: "Macros", id: 1235, icon: "icon-folder-close blue", view: section + "/edit/" + 1235, children: [], expanded: false, level: 1 },
						{ name: "Pacakges", id: 1236, icon: "icon-folder-close green", view: section + "/edit/" + 1236, children: [], expanded: false, level: 1 },
						{ name: "XSLT Files", id: 1237, icon: "icon-folder-close red", view: section + "/edit/" + 1237, children: [], expanded: false, level: 1 },
						{ name: "Razor Files", id: 1237, icon: "icon-folder-close", view: section + "/edit/" + 1237, children: [], expanded: false, level: 1 }
						]
					};
					break;
					case "settings":
					t = {
						name: section,
						alias: section,

						children: [
						{ name: "Stylesheets", id: 1234, icon: "icon-folder-close", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
						{ name: "Templates", id: 1235, icon: "icon-folder-close", view: section + "/edit/" + 1235, children: [], expanded: false, level: 1 },
						{ name: "Dictionary", id: 1236, icon: "icon-folder-close", view: section + "/edit/" + 1236, children: [], expanded: false, level: 1 },
						{ name: "Media types", id: 1237, icon: "icon-folder-close", view: section + "/edit/" + 1237, children: [], expanded: false, level: 1 },
						{ name: "Document types", id: 1237, icon: "icon-folder-close", view: section + "/edit/" + 1237, children: [], expanded: false, level: 1 }
						]
					};
					break;
					default: 
					t = {
						name: section,
						alias: section,

						children: [
						{ name: "random-name-" + section, id: 1234, icon: "icon-home", defaultAction: "create", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
						{ name: "random-name-" + section, id: 1235, icon: "icon-folder-close", defaultAction: "create", view: section + "/edit/" + 1235, children: [], expanded: false, level: 1 },
						{ name: "random-name-" + section, id: 1236, icon: "icon-folder-close", defaultAction: "create", view: section + "/edit/" + 1236, children: [], expanded: false, level: 1 },
						{ name: "random-name-" + section, id: 1237, icon: "icon-folder-close", defaultAction: "create", view: section + "/edit/" + 1237, children: [], expanded: false, level: 1 }
						]
					};
					break;
				}				

				treeArray[section] = t;
				return treeArray[section];
			},

			getActions: function(treeItem, section){
				return [
				{ name: "Create", cssclass: "plus", alias: "create" },

				{ seperator: true, name: "Delete", cssclass: "remove", alias: "delete" },
				{ name: "Move", cssclass: "move",  alias: "move" },
				{ name: "Copy", cssclass: "copy", alias: "copy" },
				{ name: "Sort", cssclass: "sort", alias: "sort" },
				
				{ seperator: true, name: "Publish", cssclass: "globe", alias: "publish" },
				{ name: "Rollback", cssclass: "undo", alias: "rollback" },
				
				{ seperator: true, name: "Permissions", cssclass: "lock", alias: "permissions" },
				{ name: "Audit Trail", cssclass: "time", alias: "audittrail" },
				{ name: "Notifications", cssclass: "envelope", alias: "notifications" },

				{ seperator: true, name: "Hostnames", cssclass: "home", alias: "hostnames" },
				{ name: "Public Access", cssclass: "group", alias: "publicaccess" },
				
				{ seperator: true, name: "Reload", cssclass: "refresh", alias: "users" }
				];
			},	

			getChildActions: function(treeItem, section){
				return [
				{ name: "Create", cssclass: "plus", alias: "create" },

				{ seperator: true, name: "Delete", cssclass: "remove", alias: "delete" },
				{ name: "Move", cssclass: "move",  alias: "move" },
				{ name: "Copy", cssclass: "copy", alias: "copy" },
				{ name: "Sort", cssclass: "sort", alias: "sort" },
				
				{ seperator: true, name: "Publish", cssclass: "globe", alias: "publish" },
				{ name: "Rollback", cssclass: "undo", alias: "rollback" },
				
				{ seperator: true, name: "Permissions", cssclass: "lock", alias: "permissions" },
				{ name: "Audit Trail", cssclass: "time", alias: "audittrail" },
				{ name: "Notifications", cssclass: "envelope", alias: "notifications" },

				{ seperator: true, name: "Hostnames", cssclass: "home", alias: "hostnames" },
				{ name: "Public Access", cssclass: "group", alias: "publicaccess" },
				
				{ seperator: true, name: "Reload", cssclass: "refresh", alias: "users" }
				];
			},

			getChildren: function (treeItem, section) {
				var iLevel = treeItem.level + 1;
				return [
					{ name: "child-of-" + treeItem.name, id: iLevel + "" + 1234, icon: "icon-file-alt", view: section + "/edit/" + iLevel + "" + 1234, children: [], expanded: false, level: iLevel },
					{ name: "random-name-" + section, id: iLevel + "" + 1235, icon: "icon-file-alt blue", view: section + "/edit/" + iLevel + "" + 1235, children: [], expanded: false, level: iLevel },
					{ name: "random-name-" + section, id: iLevel + "" + 1236, icon: "icon-file-alt green", view: section + "/edit/" + iLevel + "" + 1236, children: [], expanded: false, level: iLevel },
					{ name: "random-name-" + section, id: iLevel + "" + 1237, icon: "icon-file-alt purple", view: section + "/edit/" + iLevel + "" + 1237, children: [], expanded: false, level: iLevel }
				];
			}
		};
	});
angular.module('templates.app', []);


angular.module('templates.common', []);

