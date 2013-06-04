//Handles the section area of the app
angular.module('umbraco').controller("NavigationController",
    function ($scope, navigationService) {
    
    $scope.selectedId = navigationService.currentId;
    $scope.sections = navigationService.sections();
    
    //events
    $scope.$on("treeOptionsClick", function(ev, node){
            navigationService.showMenu(node, ev);
    });
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
       $scope.ui.mode("default-hidesearch");
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
angular.module('umbraco').controller("MainController", 
    function ($scope, notifications, $routeParams, userFactory, navigationService) {
    
    //also be authed for e2e test
    var d = new Date();
    var weekday = new Array("Super Sunday", "Manic Monday", "Tremendous Tuesday", "Wonderfull Wednesday", "Thunder Thursday", "Friendly Friday", "Shiny Saturday");
    $scope.today = weekday[d.getDay()];

    //load navigation service handlers
    $scope.changeSection = navigationService.changeSection;    
    $scope.showTree = navigationService.showTree;
    $scope.hideTree = navigationService.hideTree;
    $scope.hideMenu = navigationService.hideMenu;
    $scope.showDialog = navigationService.showDialog;
    $scope.hideDialog = navigationService.hideDialog;
    $scope.hideNavigation = navigationService.hideNavigation;
    $scope.ui = navigationService.ui;

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

    $scope.removeNotification = function(index) {
        notifications.remove(index);
    };

    $scope.closeDialogs = function(event){
        if(navigationService.ui.stickyNavigation && $(event.target).parents(".umb-modalcolumn").size() == 0){ 
            navigationService.hideNavigation();
        }
    };

    if (userFactory.authenticated) {
        $scope.signin();
    }
});
