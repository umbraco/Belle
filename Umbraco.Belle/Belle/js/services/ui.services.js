'use strict';

/* UI Services, tree, modal and notifications */

define([ 'angular'], function (angular) {
	var uiServices =  angular.module('umbraco.ui.services', []);
	 
	 /*****
	     TREE
	 ****/
	 uiServices.factory('$section', function () {
	     var currentSection = "content";
		 return {
	     	all: function(){
	     		return [
		                { name: "Content", cssclass: "file", alias: "content" },
		                { name: "Media", cssclass: "picture", alias: "media" },
		                { name: "Settings", cssclass: "dashboard",  alias: "settings" },
		                { name: "Developer", cssclass: "cog", alias: "developer" },
		                { name: "Users", cssclass: "user", alias: "users" }
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

	             var t = {
	                 name: section,
	                 alias: section,
	                 children: [
	                     { name: "random-name-" + section, id: 1234, icon: "icon-home", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
	                     { name: "random-name-" + section, id: 1235, icon: "icon-folder-close", view: section + "/edit/" + 1235, children: [], expanded: false, level: 1 },
	                     { name: "random-name-" + section, id: 1236, icon: "icon-folder-close", view: section + "/edit/" + 1236, children: [], expanded: false, level: 1 },
	                     { name: "random-name-" + section, id: 1237, icon: "icon-folder-close", view: section + "/edit/" + 1237, children: [], expanded: false, level: 1 }
	                 ]
	             };


	             treeArray[section] = t;
	             return treeArray[section];
	         },

	        getActions: function(treeItem, section){

     		return [
	                { name: "Create", cssclass: "plus", alias: "content" },

	                { seperator: true, name: "Delete", cssclass: "remove", alias: "media" },
	                { name: "Move", cssclass: "move",  alias: "settings" },
	                { name: "Copy", cssclass: "copy", alias: "developer" },
	                { name: "Sort", cssclass: "sort", alias: "users" },
	                
	                { seperator: true, name: "Publish", cssclass: "globe", alias: "users" },
					{ name: "Rollback", cssclass: "undo", alias: "users" },
	                
	                { seperator: true, name: "Permissions", cssclass: "lock", alias: "users" },
	                { name: "Audit Trail", cssclass: "time", alias: "time" },
	                { name: "Notifications", cssclass: "envelope", alias: "users" },

	                { seperator: true, name: "Hostnames", cssclass: "home", alias: "users" },
	                { name: "Public Access", cssclass: "group", alias: "users" },
	                
	                { seperator: true, name: "Reload", cssclass: "refresh", alias: "users" },
	            ];
	         },	

	         getChildren: function (treeItem, section) {
	             var iLevel = treeItem.level + 1;
	             return [
	                 { name: "child-of-" + treeItem.name, id: iLevel + "" + 1234, icon: "icon-file-alt", view: section + "/edit/" + iLevel + "" + 1234, children: [], expanded: false, level: iLevel },
	                 { name: "random-name-" + section, id: iLevel + "" + 1235, icon: "icon-file-alt", view: section + "/edit/" + iLevel + "" + 1235, children: [], expanded: false, level: iLevel },
	                 { name: "random-name-" + section, id: iLevel + "" + 1236, icon: "icon-file-alt", view: section + "/edit/" + iLevel + "" + 1236, children: [], expanded: false, level: iLevel },
	                 { name: "random-name-" + section, id: iLevel + "" + 1237, icon: "icon-file-alt", view: section + "/edit/" + iLevel + "" + 1237, children: [], expanded: false, level: iLevel }
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
				  var $modal = $('<div class="modal umb-modal  hide" tabindex="-1"></div>').attr('id', id).addClass('fade').html(template);
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
				}
	 			,
				mediaPicker: function(options){
				    return _open({
				                    scope: options.scope, 
				                    callback: options.callback, 
				                    template: 'views/application/dialogs/media.html', 
				                    show: true, backdrop: 'static'});
				},
				contentPicker: function(options){
				    return _open({
				                    scope: options.scope, 
				                    callback: options.callback, 
				                    template: 'views/application/dialogs/media.html', 
				                    show: true, backdrop: 'static'});
				}  
	 	};

	 }]);
	 
	 return uiServices;
});		