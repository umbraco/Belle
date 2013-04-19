'use strict';

define([ 'app'], function (app) {

//Handles the section area of the app
app.controller("NavigationController", function ($scope, $window, $tree, $section, stateManager, $rootScope) {
    stateManager.registerInitialiser(function (pathComponents) {
        loadTree(pathComponents[0]);
        $scope.sections = $section.all();
    })($scope);
    
    $scope.openSection = function (section) {
        stateManager.pushState([section.alias]);
        $section.setCurrent(section.alias);
        $scope.currentSection = section.alias;
        $scope.showSectionTree(section);
    };

    $scope.hideSectionTree = function () {
        $scope.ui.treeVisible = false;
        $scope.hideContextMenu();
    };

    $scope.showSectionTree = function (section) {
        $scope.ui.treeVisible = true;
        loadTree(section.alias);
    };


    $scope.getTreeChildren = function (node) {
        if (node.expanded)
            node.expanded = false;
        else {
            node.children =  $tree.getChildren(node, $scope.section);
            node.expanded = true;
        }   
    };

    $scope.setTreePadding = function(item) {
        return { 'padding-left': (item.level * 20) + "px" };
    };


    $scope.showContextMenu = function (item) {
        $scope.ui.showContextMenu = true;
        $scope.contextMenu = $tree.getActions(item, $scope.section);
        $scope.currentNode = item; 

        //do some opening stuff here...
    };

    $scope.hideContextMenu = function () {
        $scope.ui.showContextMenu = false;
        $scope.contextMenu = [];
    };

    function loadTree(section) {
      //  $scope.hideContextMenu();

        $scope.section = section;
        $scope.tree =  $tree.getTree($scope.section);
    }
});


app.controller("DashboardController", function ($scope, $routeParams) {
    $scope.name = $routeParams.section;
});


//handles authentication and other application.wide services
app.controller("MainController", function ($scope, stateManager, $notification) {
    var d = new Date();
    var authCookie = jQuery.cookie('authed') == "authenticated";
    
    //also be authed for e2e test
    //authCookie = true;
    var weekday = new Array("Super Sunday", "Manic Monday", "Tremendous Tuesday", "Wonderfull Wednesday", "Thunder Thursday", "Friendly Friday", "Shiny Saturday");
    $scope.today = weekday[d.getDay()];

    stateManager.registerInitialiser(function (pathComponents) {
        console.log("root INIT");
    })($scope); 

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