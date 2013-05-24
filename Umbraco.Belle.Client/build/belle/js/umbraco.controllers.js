'use strict';
/*! umbraco - v0.0.1-SNAPSHOT - 2013-05-24
 * http://umbraco.github.io/Belle
 * Copyright (c) 2013 Per Ploug, Anders Stenteberg & Shannon Deminick;
 * Licensed MIT
 */

define(['angular'], function (angular) {
//Handles the section area of the app
angular.module('umbraco').controller("NavigationController", function ($scope, $window, tree, section, $rootScope, $routeParams, dialog) {
    loadTree($routeParams.section);
    
    $scope.currentSection = $routeParams.section;
    $scope.selectedId = $routeParams.id;
    $scope.sections = section.all();

    $scope.setMode = setMode;
    $scope.setMode("default");


    $scope.openSection = function (selectedSection) {
        //reset everything
        $scope.setMode("default");
        $("#search-form input").focus();

        section.setCurrent(selectedSection.alias);

        $scope.currentSection = selectedSection.alias;
        $scope.showSectionTree(selectedSection);
    };
    $scope.showSectionTree = function (section) {
        if(!$scope.ui.stickyNavigation){
            $("#search-form input").focus();
            loadTree(section.alias);
            $scope.setMode("tree");
        }
    };
    $scope.hideSectionTree = function () {
        if(!$scope.ui.stickyNavigation){
            $scope.setMode("default");
        }
    };

    $scope.showContextMenu = function (item, ev) {
        if(ev != undefined && item.defaultAction && !ev.altKey){
            //hack for now, it needs the complete action object to, so either include in tree item json
            //or lookup in service...
            var act = {
                        alias: item.defaultAction,
                        name: item.defaultAction
                    };
             $scope.showContextDialog(item, act);
       }else{
            $scope.contextMenu = tree.getActions(item, $scope.section);
            $scope.currentNode = item;
            $scope.menuTitle = item.name;
            $scope.selectedId = item.id;
            $scope.setMode("menu");
        }
    };

    $scope.hideContextMenu = function () {
        $scope.selectedId = $routeParams.id;
        $scope.contextMenu = [];
        $scope.setMode("tree");
    };

    $scope.showContextDialog = function (item, action) {
        $scope.setMode("dialog");

        $scope.currentNode = item;
        $scope.dialogTitle = action.name;

        var templateUrl = "views/" + $scope.currentSection + "/" + action.alias + ".html";
        var d = dialog.append({container: $("#dialog div.umb-panel-body"), scope: $scope, template: templateUrl });
    };    

    $scope.hideContextDialog = function () {
        $scope.showContextMenu($scope.currentNode, undefined);
    };    

    $scope.hideNavigation = function () {
        $scope.setMode("default");
    };

    $scope.setTreePadding = function(item) {
        return { 'padding-left': (item.level * 20) + "px" };
    };
    $scope.getTreeChildren = function (node) {
        if (node.expanded)
            node.expanded = false;
        else {
            node.children =  tree.getChildren(node, $scope.currentSection);
            node.expanded = true;
        }   
    };

    function loadTree(section) {
        $scope.currentSection = section;
        $scope.tree =  tree.getTree($scope.currentSection);
    }

    //function to turn navigation areas on/off
    function setMode(mode){
            switch(mode)
            {
            case 'tree':
                $scope.ui.showNavigation = true;
                $scope.ui.showContextMenu = false;
                $scope.ui.showContextMenuDialog = false;
                $scope.ui.stickyNavigation = false;
                break;
            case 'menu':
                $scope.ui.showNavigation = true;
                $scope.ui.showContextMenu = true;
                $scope.ui.showContextMenuDialog = false;
                $scope.ui.stickyNavigation = false;
                break;
            case 'dialog':
                $scope.ui.stickyNavigation = true;
                $scope.ui.showNavigation = true;
                $scope.ui.showContextMenu = false;
                $scope.ui.showContextMenuDialog = true;
                break;
            case 'search':
                $scope.ui.stickyNavigation = false;
                $scope.ui.showNavigation = true;
                $scope.ui.showContextMenu = false;
                $scope.ui.showSearchResults = true;
                $scope.ui.showContextMenuDialog = false;
                break;      
            default:
                $scope.ui.showNavigation = false;
                $scope.ui.showContextMenu = false;
                $scope.ui.showContextMenuDialog = false;
                $scope.ui.showSearchResults = false;
                $scope.ui.stickyNavigation = false;
                break;
            }
    }
});


angular.module('umbraco').controller("SearchController", function ($scope, search, $log) {

    var currentTerm = "";
    $scope.deActivateSearch = function(){
       currentTerm = ""; 
    };

    $scope.performSearch = function (term) {
        if(term != undefined && term != currentTerm){
            if(term.length > 3){
                $scope.ui.selectedSearchResult = -1;
                $scope.setMode("search");

                currentTerm = term;
                $scope.ui.searchResults = search.search(term, $scope.currentSection);

            }else{
                $scope.ui.searchResults = [];
            }
        }
    };    

    $scope.hideSearch = function () {
       $scope.setMode("default");
    };

    $scope.iterateResults = function (direction) {
       if(direction == "up" && $scope.ui.selectedSearchResult < $scope.ui.searchResults.length) 
            $scope.ui.selectedSearchResult++;
        else if($scope.ui.selectedSearchResult > 0)
            $scope.ui.selectedSearchResult--;
    };

    $scope.selectResult = function () {
        $scope.showContextMenu($scope.ui.searchResults[$scope.ui.selectedSearchResult], undefined);
    };
});


angular.module('umbraco').controller("DashboardController", function ($scope, $routeParams) {
    $scope.name = $routeParams.section;
});


//handles authentication and other application.wide services
angular.module('umbraco').controller("MainController", function ($scope, notifications, $routeParams, userFactory) {
    
    //also be authed for e2e test
    var d = new Date();
    var weekday = new Array("Super Sunday", "Manic Monday", "Tremendous Tuesday", "Wonderfull Wednesday", "Thunder Thursday", "Friendly Friday", "Shiny Saturday");
    $scope.today = weekday[d.getDay()];

    $scope.ui = {
        showTree: false,
        showSearchResults: false
    };

    $scope.signin = function () {
        $scope.authenticated = user.authenticate($scope.login, $scope.password);

        if($scope.authenticated){
            $scope.user = user.getCurrentUser();
        }
    };

    $scope.signout = function () {
        user.signout();
        $scope.authenticated = false;
    };

    //subscribes to notifications in the notification service
    $scope.notifications = notifications.current;
    $scope.$watch('notifications.current', function (newVal, oldVal, scope) {
        if (newVal) {
            $scope.notifications = newVal;
        }
    });

    //subscribes to auth status in $user
    $scope.authenticated = userFactory.authenticated;
    $scope.$watch('userFactory.authenticated', function (newVal, oldVal, scope) {
        if (newVal) {
            $scope.authenticated = newVal;
        }
    });

    $scope.removeNotification = function(index) {
        notifications.remove(index);
    };

/*
    if ($scope.authenticated) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.signin();
        });
    }*/
});


//used for the macro picker dialog
angular.module("umbraco").controller("Umbraco.Dialogs.MacroPickerController", function ($scope, macroFactory) {	
	$scope.macros = macroFactory.all(true);
	$scope.dialogMode = "list";

	$scope.configureMacro = function(macro){
		$scope.dialogMode = "configure";
		$scope.dialogData.macro = macroFactory.getMacro(macro.alias);
	};
});
//used for the media picker dialog
angular.module("umbraco").controller("Umbraco.Dialogs.MediaPickerController", function ($scope, mediaFactory) {	
	$scope.images = mediaFactory.rootMedia();
});
angular.module('umbraco').controller("Umbraco.Editors.ContentCreateController", function ($scope, $routeParams,contentTypeFactory) {	
	$scope.allowedTypes  = contentTypeFactory.allowedTypes($scope.currentNode.id);	
});
angular.module("umbraco").controller("Umbraco.Editors.ContentEditController", function ($scope, $routeParams, contentFactory) {
	if($routeParams.create)
		$scope.content = contentFactory.getContentScaffold($routeParams.parentId, $routeParams.doctype);
	else
		$scope.content = contentFactory.getContent($routeParams.id);

	$scope.saveAndPublish = function (cnt) {
		cnt.publishDate = new Date();
		contentFactory.publishContent(cnt);
	};

	$scope.save = function (cnt) {
		cnt.updateDate = new Date();
		contentFactory.saveContent(cnt);
	};
});
angular.module("umbraco").controller("Umbraco.Editors.CodeMirrorController", function ($scope, $rootScope) {
    require(
        [
            'css!../lib/codemirror/js/lib/codemirror.css',
            'css!../lib/codemirror/css/umbracoCustom.css',
            'codemirrorHtml'
        ],
        function () {

            var editor = CodeMirror.fromTextArea(
                                    document.getElementById($scope.model.alias), 
                                    {
                                        mode: CodeMirror.modes.htmlmixed, 
                                        tabMode: "indent"
                                    });

            editor.on("change", function(cm) {
                $rootScope.$apply(function(){
                    $scope.model.value = cm.getValue();   
                });
            });

        });
});
angular.module("umbraco").controller("Umbraco.Editors.GoogleMapsController", function ($rootScope, $scope, notifications) {
    require(
        [
            'async!http://maps.google.com/maps/api/js?sensor=false'
        ],
        function () {
            //Google maps is available and all components are ready to use.
            var valueArray = $scope.model.value.split(',');
            var latLng = new google.maps.LatLng(valueArray[0], valueArray[1]);
            
            var mapDiv = document.getElementById($scope.model.alias + '_map');
            var mapOptions = {
                zoom: $scope.model.config.zoom,
                center: latLng,
                mapTypeId: google.maps.MapTypeId[$scope.model.config.mapType]
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
                $scope.model.value = newLat + "," + newLng;

                //call the notication engine
                $rootScope.$apply(function () {
                    notifications.warning("Your dragged a marker to", $scope.model.value);
                });
            });
        }
    );    
});
'use strict';
//this controller simply tells the dialogs service to open a mediaPicker window
//with a specified callback, this callback will receive an object with a selection on it
angular.module("umbraco").controller("Umbraco.Editors.GridController", function($rootScope, $scope, dialog, $log){
    //we most likely will need some iframe-motherpage interop here
    $log.log("loaded");

    $scope.openMediaPicker =function(){
            var d = dialog.mediaPicker({scope: $scope, callback: populate});
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
//this controller simply tells the dialogs service to open a mediaPicker window
//with a specified callback, this callback will receive an object with a selection on it
angular.module('umbraco').controller("mediaPickerController", function($rootScope, $scope, dialog){
    $scope.openMediaPicker =function(value){
            var d = dialog.mediaPicker({scope: $scope, callback: populate});
    };

    function populate(data){
        $scope.model.value = data.selection;    
    }
});
angular.module("umbraco").controller("Umbraco.Editors.RTEController", function($rootScope, $scope, dialog, $log){
    require(
        [
            'tinymce'
        ],
        function (tinymce) {

            tinymce.DOM.events.domLoaded = true;

            tinymce.init({
               selector: "#" + $scope.model.alias,
               handle_event_callback : "myHandleEvent" 
             });
        
            $scope.openMediaPicker =function(value){
                    var d = dialog.mediaPicker({scope: $scope, callback: populate});
            };

            function bindValue(inst){
                $log.log("woot");

                $scope.$apply(function(){
                    $scope.model.value = inst.getBody().innerHTML;
                })
            }

            function myHandleEvent(e){
                $log.log(e);
            }

            function populate(data){
                $scope.model.value = data.selection;    
            }

        });
});

return angular;
});