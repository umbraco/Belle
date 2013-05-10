define(['angular', 'namespaceMgr'], function (angular) {

    Umbraco.Sys.registerNamespace("System.Controllers");

    System.Controllers.TestController = function($scope, $http, $log, $filter) {

        $scope.properties = [
            {
                alias: "numbers",
                label: "Numeric",
                description: "Enter a numeric value",
                view: "/App_Plugins/MyPackage/PropertyEditors/Regex.html",
                value: "12345987765",
                config: {
                    format: "## #### ####"
                }
            },
            {
                alias: "serverEnvironment",
                label: "Server Info",
                description: "Some server information",
                view: Umbraco.Sys.ServerVariables.MyPackage.serverEnvironmentView,
                value: ""
            },
            {
                alias: "complexEditor",
                label: "Multiple Values",
                description: "A multi value editor",
                view: "/App_Plugins/MyPackage/PropertyEditors/CsvEditor.html",
                value: "My Value 1, My Value 2, My Value 3, My Value 4, My Value 5"
            }
        ];

        $scope.valueToPost = [];

        $scope.save = function () {
            $scope.valueToPost = [];
            for (var p in $scope.properties) {
                $scope.valueToPost.push({
                    alias: $scope.properties[p].alias,
                    value: $scope.properties[p].value
                });
            }

            $http.post('@(postSaveUrl)', $scope.valueToPost).
            success(function (data, status, headers, config) {
                alert("success!");
            }).
            error(function (data, status, headers, config) {
                alert("failed!");
            });
        };

    };


    // declare and return the app module
    var myAppModule = angular.module('myApp', []);
    return myAppModule;
});