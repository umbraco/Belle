define(['angular', 'namespaceMgr'], function (angular) {

    Umbraco.Sys.registerNamespace("System.Controllers");

    System.Controllers.TestController = function($scope, $http, $log, $filter) {

        //initialize the data model
        $scope.model = {};
        //model for updating the UI
        $scope.ui = {
            working: false,
            canSubmit: function() {
                return $scope.form.$invalid || $scope.ui.working;
            }
        };

        //the url to get the content from
        var getContentUrl = Umbraco.Sys.ServerVariables.contentEditorApiBaseUrl + "GetContent?id=" + 1;
        var saveContentUrl = Umbraco.Sys.ServerVariables.contentEditorApiBaseUrl + "PostSaveContent";

        //go get the content from the server
        $scope.ui.working = true;
        $http.get(getContentUrl, $scope.valueToPost).
            success(function(data, status, headers, config) {
                //set the model to the value returned by the server
                $scope.model = data;
                $scope.ui.working = false;
            }).
            error(function(data, status, headers, config) {
                alert("failed!");
                $scope.ui.working = false;
            });

        $scope.save = function () {
            $scope.ui.working = true;
            $http.post(saveContentUrl, $scope.model).
                success(function(data, status, headers, config) {
                    alert("success!");
                    $scope.ui.working = false;
                }).
                error(function(data, status, headers, config) {
                    alert("failed!");
                    $scope.ui.working = false;
                });
        };

    };


    // declare and return the app module
    var myAppModule = angular.module('myApp', []);
    return myAppModule;
});