'use strict';

define([ 'app'], function (app) {

//Handles the section area of the app
app.controller("SectionController", function ($scope, $window, stateManager, $rootScope) {
    stateManager.registerInitialiser(function (pathComponents) {
        $scope.sections =
            [
                { name: "Content", cssclass: "file", alias: "content" },
                { name: "Media", cssclass: "picture", alias: "media" },
                { name: "Settings", cssclass: "dashboard",  alias: "settings" },
                { name: "Developer", cssclass: "cog", alias: "developer" },
                { name: "Users", cssclass: "user", alias: "users" }
            ];
    })($scope);
    
    
    $scope.openSection = function (section) {
        stateManager.pushState([section.alias]);
        $scope.ui.treeVisible = true;

        $rootScope.$broadcast('showSectionTree', section.alias);
        $rootScope.$broadcast('openSection', section.alias);
    };

    $scope.hideSectionTree = function () {
        $scope.ui.treeVisible = false;
        $rootScope.$broadcast('hideSectionTree');
    };

    $scope.showSectionTree = function (section) {
        $scope.ui.treeVisible = true;
        $rootScope.$broadcast('showSectionTree', section.alias);
    };
});


app.controller("TreeController", function ($scope, treeFactory, $routeParams, stateManager) {

    stateManager.registerInitialiser(function (pathComponents) {
        loadTree(pathComponents);
        
        if(pathComponents.length > 2){
            $scope.selectedId = pathComponents[2];    
         }

        //Do whatever you like here to respond to state changes: load subviews via ng-include, load content via AJAX, whatever...
        //If you load in new subviews via ng-include and if doing so causes an ng-controller directive to be compiled, that new controller's initialiser will also get called once it's loaded.
    })($scope);

    $scope.getChildren = function (node) {
        if (node.expanded)
            node.expanded = false;
        else {
            node.children = treeFactory.getChildren(node, $scope.section);
            node.expanded = true;
        }
    };

    $scope.setPadding = function(item) {
        return { 'padding-left': (item.level * 20) + "px" };
    };

    $scope.$on('showSectionTree', function(event, section) {
        $scope.section = section;
        $scope.tree = treeFactory.getTree($scope.section);
    });

    function loadTree(pathComponents) {
        $scope.section = pathComponents[0];
        $scope.tree = treeFactory.getTree($scope.section);
    }

    $scope.openContextMenu = function (item) {
        $scope.showMenu = true;
        $scope.contextMenu = ["Create", "Copy", "move", "Quit"];
        //do some opening stuff here...
    };
    

    $scope.closeContextMenu = function (item) {
        $scope.showMenu = false;
        $scope.contextMenu = [];
    };
    
});


app.controller("DashboardController", function ($scope, $routeParams) {
    $scope.name = $routeParams.section;
});


//handles authentication and other application.wide services
app.controller("MainController", function ($scope, stateManager, notificationFactory) {
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
    $scope.notifications = notificationFactory.notifications;
    $scope.$watch('notificationFactory.notifications', function (newVal, oldVal, scope) {
        if (newVal) {
            $scope.notifications = newVal;
        }
    });

    $scope.removeNotification = function(index) {
        notificationFactory.remove(index);
    };

    if (authCookie) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.signin();
        });
    }
});

return app;
});