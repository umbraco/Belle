//Handles the section area of the app
angular.module('umbraco').controller("NavigationController", function ($scope, $window, tree, section, $rootScope, $routeParams, dialog) {
    loadTree($routeParams.section);
    
    $scope.currentSection = $routeParams.section;
    $scope.selectedId = $routeParams.id;
    $scope.sections = section.all();

    $scope.ui.mode = setMode;
    $scope.ui.mode("default");


    $scope.openSection = function (selectedSection) {
        //reset everything
        $scope.ui.mode("default");
        $("#search-form input").focus();

        section.setCurrent(selectedSection.alias);

        $scope.currentSection = selectedSection.alias;
        $scope.showSectionTree(selectedSection);
    };
    $scope.showSectionTree = function (section) {
        if(!$scope.ui.stickyNavigation){
            $("#search-form input").focus();
            loadTree(section.alias);
            $scope.ui.mode("tree");
        }
    };
    $scope.hideSectionTree = function () {
        if(!$scope.ui.stickyNavigation){
            $scope.ui.mode("default");
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
            $scope.ui.mode("menu");
        }
    };

    $scope.hideContextMenu = function () {
        $scope.selectedId = $routeParams.id;
        $scope.contextMenu = [];
        $scope.ui.mode("tree");
    };

    $scope.showContextDialog = function (item, action) {
        $scope.ui.mode("dialog");

        $scope.currentNode = item;
        $scope.dialogTitle = action.name;

        var templateUrl = "views/" + $scope.currentSection + "/" + action.alias + ".html";
        var d = dialog.append({container: $("#dialog div.umb-panel-body"), scope: $scope, template: templateUrl });
    };    

    $scope.hideContextDialog = function () {
        $scope.showContextMenu($scope.currentNode, undefined);
    };    

    $scope.hideNavigation = function () {
        $scope.ui.mode("default");
    };

    $scope.setTreePadding = function(item) {
        return { 'padding-left': (item.level * 20) + "px" };
    };
    $scope.getTreeChildren = function (node) {
        if (node.expanded){
            node.expanded = false;
            node.children = [];
        }else {
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
                $scope.ui.stickyNavigation = true;
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
                $scope.ui.mode("search");

                currentTerm = term;
                $scope.ui.searchResults = search.search(term, $scope.currentSection);

            }else{
                $scope.ui.searchResults = [];
            }
        }
    };    

    $scope.hideSearch = function () {
       $scope.ui.mode("default");
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
        showSearchResults: false,
        mode: undefined
    };

    $scope.signin = function () {
        $scope.authenticated = userFactory.authenticate($scope.login, $scope.password);

        if($scope.authenticated){
            $scope.user = userFactory.getCurrentUser();
        }
    };

    $scope.signout = function () {
        userFactory.signout();
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

    $scope.closeDialogs = function(event){
        if($(event.target).parents(".umb-modalcolumn").size() == 0){ 
            $scope.ui.mode("default");
            //jQuery(".umb-modalcolumn").hide();
        }
    };

    if ($scope.authenticated) {
        $scope.user = userFactory.getCurrentUser();
    }
    
/*
    else{    
        $scope.$on('$viewContentLoaded', function() {
            $scope.signin();
        });
    }*/
});
