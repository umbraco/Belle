'use strict';

define([ 'app'], function (app) {



//Handles the section area of the app
app.controller("NavigationController", function ($scope, $window, $tree, $section, stateManager, $rootScope, $routeParams, $dialog) {
    
    loadTree($routeParams.section);
    
    $scope.currentSection = $routeParams.section;
    $scope.selectedId = $routeParams.id;
    $scope.sections = $section.all();

    setMode("default");

    $scope.openSection = function (section) {
        //reset everything
        setMode("default");

        $section.setCurrent(section.alias);
        $scope.currentSection = section.alias;
        $scope.showSectionTree(section);
    };
    $scope.showSectionTree = function (section) {
        if(!$scope.ui.stickyNavigation){
            loadTree(section.alias);
            setMode("tree");
        }
    };
    $scope.hideSectionTree = function () {
        if(!$scope.ui.stickyNavigation){
            setMode("default");
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
            $scope.contextMenu = $tree.getActions(item, $scope.section);
            $scope.currentNode = item;
            $scope.menuTitle = item.name;
            $scope.selectedId = item.id;
            setMode("menu");
        }
    };
    $scope.hideContextMenu = function () {
        $scope.selectedId = $routeParams.id;
        $scope.contextMenu = [];
        setMode("tree");
    };

    $scope.showContextDialog = function (item, action) {
        setMode("dialog");

        $scope.currentNode = item;
        $scope.dialogTitle = action.name;

        var templateUrl = "views/" + $scope.currentSection + "/" + action.alias + ".html";
        var d = $dialog.append({container: $("#dialog div.umb-panel-body"), scope: $scope, template: templateUrl });
    };    

    $scope.hideContextDialog = function () {
        $scope.showContextMenu($scope.currentNode, undefined);
    };    


    $scope.hideNavigation = function () {
        setMode("default");
    };

    $scope.setTreePadding = function(item) {
        return { 'padding-left': (item.level * 20) + "px" };
    };
    $scope.getTreeChildren = function (node) {
        if (node.expanded)
            node.expanded = false;
        else {
            node.children =  $tree.getChildren(node, $scope.currentSection);
            node.expanded = true;
        }   
    };

    function loadTree(section) {
        $scope.currentSection = section;
        $scope.tree =  $tree.getTree($scope.currentSection);
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
            default:
                //Reset everything
                $scope.ui.showNavigation = false;
                $scope.ui.showContextMenu = false;
                $scope.ui.showContextMenuDialog = false;
                $scope.ui.stickyNavigation = false;
            }
    }
});

app.controller("DashboardController", function ($scope, $routeParams) {
    $scope.name = $routeParams.section;
});

//handles authentication and other application.wide services
app.controller("MainController", function ($scope, $notification, $routeParams) {
    var d = new Date();
    var authCookie = jQuery.cookie('authed') == "authenticated";
    
    //also be authed for e2e test
    authCookie = true;
    var weekday = new Array("Super Sunday", "Manic Monday", "Tremendous Tuesday", "Wonderfull Wednesday", "Thunder Thursday", "Friendly Friday", "Shiny Saturday");
    $scope.today = weekday[d.getDay()];

    $scope.ui = {
        treeVisible: false
    };

    $scope.user = {
        authenticated: authCookie,
        name: '',
        password: ''
    };  

    $scope.signin = function () {
        jQuery.cookie('authed', "authenticated");
        $scope.user.authenticated = true;
        //$rootScope.$broadcast('start', 'content');
    };

    $scope.signout = function () {
        jQuery.cookie('authed', null);
        $scope.user.authenticated = false;
    };

    //subscribes to notifications in the notification service
    $scope.notifications = $notification.notifications;
    $scope.$watch('$notification.notifications', function (newVal, oldVal, scope) {
        if (newVal) {
            $scope.notifications = newVal;
        }
    });

    $scope.removeNotification = function(index) {
        $notifications.remove(index);
    };

    if (authCookie) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.signin();
        });
    }
});

return app;
});