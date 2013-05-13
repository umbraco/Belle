'use strict';

/* UI Services, tree, modal and notifications */

define(['angular'], function (angular) {
	var uiServices =  angular.module('umbraco.ui.services', []);
	  
	 /*****
	     navigation
	 ****/
	 uiServices.factory('$section', function () {
	     var currentSection = "content";
		 return {
	     	all: function(){
	     		return [
		                { name: "Content", cssclass: "content", alias: "content" },
		                { name: "Media", cssclass: "media", alias: "media" },
		                { name: "Settings", cssclass: "settings",  alias: "settings" },
		                { name: "Developer", cssclass: "developer", alias: "developer" },
		                { name: "Users", cssclass: "user", alias: "users" }
		            ];	
	     	},
	     	
	     	setCurrent: function(sectionAlias){
	     		currentSection = sectionAlias;	
	     	}
	     };
	});

	 /*****
	     Authentication
	 ****/
	 uiServices.factory('$user', function ($rootScope) {
	     
	    var _currentUser = undefined;
	    var _authenticated = true; //jQuery.cookie('authed') == "authenticated";	     
	    
	    var _mockedU = { 
		                	name: "Per Ploug", 
		                	avatar: "img/avatar.jpeg", 
		                	id: 0,
		                	authenticated: true,
		                	locale: 'da-DK' 
		                };


		if(_authenticated)
			_currentUser = _mockedU; 


		return {
	     	authenticated: _authenticated,
	     	currentUser: _currentUser,
	     	
	     	authenticate: function(login, password){
				_authenticated = true;
	     		_currentUser = _mockedU;
	     		
	     	 	jQuery.cookie('authed', "authenticated");
	     		return _authenticated; 
		    },
	     	
	     	logout: function(){
				$rootScope.$apply(function() {
	     			_authenticated = false;
		     		jQuery.cookie('authed', null);
		     		_currentUser = undefined;
	     		});
	     	},

	     	getCurrentUser: function(){
	     		return _currentUser;
	     	}
	     };
	});

	uiServices.factory('$search', function () {
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




	 uiServices.factory('$tree', function ($section) {
	     //implement this in local storage
	     var treeArray = new Array();
	     var currentSection = "content";

	     return {
	         getTree: function (section) {
	             if (treeArray[section] != undefined)
	                 return treeArray[section];

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
	            };	 	
	             

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
	                
	                { seperator: true, name: "Reload", cssclass: "refresh", alias: "users" },
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
	                        
	                        { seperator: true, name: "Reload", cssclass: "refresh", alias: "users" },
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
	         },
	     };
	 });



	 /*****
	     NOTIFICATIONS
	 ****/
	 uiServices.factory('$notification', function ($rootScope) {

	     var nArray = new Array();

	     function add(item) {
	         var index = nArray.length;
	         nArray.push(item);

	         setTimeout(function () {
	             $rootScope.$apply(function() {
	                 nArray.splice(index, 1);
	             });
	             
	         }, 5000);
	     }

	     return {
	         success: function (headline, message) {
	             add({ headline: headline, message: message, type: 'success', time: new Date() });
	         },
	         error: function (headline, message) {
	             add({ headline: headline, message: message, type: 'error', time: new Date() });
	         },
	         warning: function (headline, message) {
	             add({ headline: headline, message: message, type: 'warning', time: new Date() });
	         },
	         remove: function (index) {
	             nArray.splice(index, 1);
	         },
	         notifications: nArray,
	     };
	 });


	 /*****
	     Dialogs
	 ****/
	 uiServices.factory('$dialog', ['$rootScope', '$compile', '$http', '$timeout', '$q', '$templateCache', function($rootScope, $compile, $http, $timeout, $q, $templateCache) {
		
		function _open(options){	
			if(!options) options = {};

			var scope = options.scope || $rootScope.$new(),
			    templateUrl = options.template;
			
			var callback = options.callback;
			return $q.when($templateCache.get(templateUrl) || $http.get(templateUrl, {cache: true}).then(function(res) { return res.data; }))
				.then(function onSuccess(template) {

			  	  // Build modal object
				  var id = templateUrl.replace('.html', '').replace(/[\/|\.|:]/g, "-") + '-' + scope.$id;
				  var $modal = $('<div class="modal umb-modal hide" tabindex="-1"></div>').attr('id', id).addClass('fade').html(template);
				  
				  if(options.modalClass) $modal.addClass(options.modalClass);

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
				                    template: 'views/application/dialogs/mediaPicker.html', 
				                    show: true, backdrop: 'static'});
				},
				contentPicker: function(options){
				    return _open({
				                    scope: options.scope, 
				                    callback: options.callback, 
				                    template: 'views/application/dialogs/contentPicker.html', 
				                    show: true, backdrop: 'static'});
				},
				macroPicker: function(options){
				    return _open({
				                    scope: options.scope, 
				                    callback: options.callback, 
				                    template: 'views/application/dialogs/macroPicker.html', 
				                    show: true, backdrop: 'static'});
				},
				propertyDialog: function(options){
				    return _open({
				                    scope: options.scope, 
				                    callback: options.callback, 
				                    template: 'views/application/dialogs/property.html', 
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
	 

	 /*****
	       Key helper, used for the keypress directive, for parsing keystrokes to functions
	       uses keymaster.js
	 ****/
	 uiServices.factory('$key', function ($rootScope, $log, $parse) {
	 	
	 	   var keysByCode = {
	 	       8: 'backspace',
	 	       9: 'tab',
	 	       13: 'enter',
	 	       27: 'esc',
	 	       32: 'space',
	 	       33: 'pageup',
	 	       34: 'pagedown',
	 	       35: 'end',
	 	       36: 'home',
	 	       37: 'left',
	 	       38: 'up',
	 	       39: 'right',
	 	       40: 'down',
	 	       45: 'insert',
	 	       46: 'delete'
	 	     };

	 	     var capitaliseFirstLetter = function (string) {
	 	       return string.charAt(0).toUpperCase() + string.slice(1);
	 	     };

	 	     return function(mode, scope, elm, attrs) {
	 	       var params, combinations = [];
	 	       params = scope.$eval(attrs['ui'+capitaliseFirstLetter(mode)]);

	 	       // Prepare combinations for simple checking
	 	       angular.forEach(params, function (v, k) {
	 	         var combination, expression;
	 	         expression = $parse(v);

	 	         angular.forEach(k.split(' '), function(variation) {
	 	           combination = {
	 	             expression: expression,
	 	             keys: {}
	 	           };
	 	           angular.forEach(variation.split('-'), function (value) {
	 	             combination.keys[value] = true;
	 	           });
	 	           combinations.push(combination);
	 	         });
	 	       });

	 	       // Check only matching of pressed keys one of the conditions
	 	       elm.bind(mode, function (event) {
	 	         // No need to do that inside the cycle
	 	         var altPressed = !!(event.metaKey || event.altKey);
	 	         var ctrlPressed = !!event.ctrlKey;
	 	         var shiftPressed = !!event.shiftKey;
	 	         var keyCode = event.keyCode;

	 	         // normalize keycodes
	 	         if (mode === 'keypress' && !shiftPressed && keyCode >= 97 && keyCode <= 122) {
	 	           keyCode = keyCode - 32;
	 	         }

	 	         // Iterate over prepared combinations
	 	         angular.forEach(combinations, function (combination) {

	 	           var mainKeyPressed = combination.keys[keysByCode[event.keyCode]] || combination.keys[event.keyCode.toString()];

	 	           var altRequired = !!combination.keys.alt;
	 	           var ctrlRequired = !!combination.keys.ctrl;
	 	           var shiftRequired = !!combination.keys.shift;

	 	           if (
	 	             mainKeyPressed &&
	 	             ( altRequired == altPressed ) &&
	 	             ( ctrlRequired == ctrlPressed ) &&
	 	             ( shiftRequired == shiftPressed )
	 	           ) {
	 	             // Run the function
	 	             scope.$apply(function () {
	 	               combination.expression(scope, { '$event': event });
	 	             });
	 	           }
	 	         });
	 	       });
	 	     };
	 	    	

	 });


	return uiServices;
});		