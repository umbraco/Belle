'use strict';

define(['angular', 'namespaceMgr'], function (angular) {

    Umbraco.Sys.registerNamespace("Umbraco.Content");

    var contentHelpers = angular.module('uModules.Content.Helpers', []);

    contentHelpers.factory('u$ContentHelper', function () {

        return {
            formatPostData: function (displayModel) {
                /// <summary>formats the display model used to display the content to the model used to save the content</summary>

                //NOTE: the display model inherits from the save model so we can in theory just post up the display model but 
                // we don't want to post all of the data as it is unecessary.

                var saveModel = {
                    id: displayModel.id,
                    properties: []
                };
                for (var p in displayModel.properties) {
                    saveModel.properties.push({
                        id: displayModel.properties[p].id,
                        value: displayModel.properties[p].value
                    });
                }
                return saveModel;
            }
        };
    });
    
    Umbraco.Content.ContentController = function ($scope, $http, u$ContentHelper) {

        //initialize the data model
        $scope.model = {};
        //model for updating the UI
        $scope.ui = {
            working: false,
            canSubmit: function () {
                return $scope.form.$invalid || $scope.ui.working;
            }
        };

        //the url to get the content from
        var getContentUrl = Umbraco.Sys.ServerVariables.contentEditorApiBaseUrl + "GetContent?id=" + 1;
        var saveContentUrl = Umbraco.Sys.ServerVariables.contentEditorApiBaseUrl + "PostSaveContent";

        //go get the content from the server
        $scope.ui.working = true;
        $http.get(getContentUrl, $scope.valueToPost).
            success(function (data, status, headers, config) {
                //set the model to the value returned by the server
                $scope.model = data;
                $scope.ui.working = false;
            }).
            error(function (data, status, headers, config) {
                alert("failed!");
                $scope.ui.working = false;
            });

        $scope.save = function () {
            $scope.ui.working = true;
            $http.post(saveContentUrl, u$ContentHelper.formatPostData($scope.model)).
                success(function (data, status, headers, config) {
                    alert("success!");
                    $scope.ui.working = false;
                }).
                error(function (data, status, headers, config) {
                    alert("failed!");
                    $scope.ui.working = false;
                });
        };

    };


    // declare and return the app module
    var myAppModule = angular.module('myApp', ['uModules.Content.Helpers']);
    return myAppModule;
    
});