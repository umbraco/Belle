'use strict';

define([ 'app'], function (app) {

//Handles the section area of the app
app.controller("NavigationController", function ($scope, $window, $tree, $section, stateManager, $rootScope, $routeParams, $dialog) {
    
    loadTree($routeParams.section);
    
    $scope.currentSection = $routeParams.section;
    $scope.selectedId = $routeParams.id;
    $scope.sections = $section.all();
    $scope.sticky = false;

    $scope.openSection = function (section) {
        $section.setCurrent(section.alias);
        $scope.currentSection = section.alias;
        $scope.showSectionTree(section);
    };
    $scope.showSectionTree = function (section) {
        $scope.ui.treeVisible = true;
        loadTree(section.alias);
    };
    $scope.hideSectionTree = function () {
        if(!$scope.sticky){
            $scope.ui.treeVisible = false;
            $scope.hideContextMenu();
        }
    };



    $scope.showContextMenu = function (item) {
        $scope.ui.showContextMenu = true;
        $scope.ui.showContextMenuDialog = false;
        $scope.sticky = false;

        $scope.contextMenu = $tree.getActions(item, $scope.section);
        $scope.currentNode = item;
        $scope.selectedId = item.id; 
    };
    $scope.hideContextMenu = function () {
        $scope.ui.showContextMenu = false;
        $scope.ui.showContextMenuDialog = false;

        $scope.selectedId = $routeParams.id;
        $scope.contextMenu = [];
    };



    $scope.showContextDialog = function (item, action) {
        var templateUrl = "views/" + $scope.currentSection + "/" + action.alias + ".html";
        var d = $dialog.append({container: $("#contextMenuDialog"), scope: $scope, template: templateUrl });
        
        $scope.ui.showContextMenuDialog = true;
        $scope.sticky = true;
    };    

    $scope.hideContextDialog = function () {
        $scope.ui.showContextMenuDialog = false;
        $scope.sticky = false;
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
      //  $scope.hideContextMenu();
        $scope.currentSection = section;
        $scope.tree =  $tree.getTree($scope.currentSection);
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
    //authCookie = true;
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