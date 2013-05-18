'use strict';

define(['angular', 'namespaceMgr'], function (angular) {

    // declare and return the app module
    var app = angular.module('myApp', ['uModules.Content.Helpers']);

    Umbraco.Sys.registerNamespace("Umbraco.Content");

    var contentHelpers = angular.module('uModules.Content.Helpers', []);

    app.directive('valForm', [
        function() {
            return {
                link: function(scope, element, attr) {
                    var form = element.inheritedData('$formController');
                    // no need to validate if form doesn't exists
                    if (!form) return;
                    // validation model
                    var errorCollection = attr.valForm;
                    // watch validate changes to display validation
                    scope.$watch(errorCollection, function (errors) {

                        // every server validation should reset others
                        // note that this is form level and NOT field level validation
                        form.$serverError = {};

                        // if errors is undefined or null just set invalid to false and return
                        if (!errors) {
                            form.$serverInvalid = false;
                            return;
                        }
                        // set $serverInvalid to true|false
                        form.$serverInvalid = (errors.length > 0);

                        // loop through errors
                        angular.forEach(errors, function(error, i) {
                            form.$serverError[error.key] = { $invalid: true, message: error.value };
                        });
                    }, true);
                }
            };
        }
    ]);

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

        //**** Create the models for the scope ****
        //initialize the data model
        $scope.model = {};
        //model for updating the UI
        $scope.ui = {
            working: false,
            canSubmit: function () {
                return $scope.form.$invalid || $scope.ui.working;
            }
        };
        //error object/collection
        $scope.errors = {
            addError: function (contentProperty, errorMsg) {
                if (!contentProperty) return;
                //only add the item if it doesn't exist                
                if (!this.hasError(contentProperty)) {
                    this.items.push({
                        alias: contentProperty.alias,
                        errorMsg: errorMsg
                    });
                }
            },
            removeError: function(contentProperty) {
                if (!contentProperty) return;
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].alias == contentProperty.alias) {
                        this.items.splice(i, 1); //remove the item
                        break;
                    }
                } 
            },
            getError: function(contentProperty) {
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].alias == contentProperty.alias) {
                        return this.items[i].errorMsg;
                    }
                }
                return null;
            },
            hasError: function(contentProperty) {
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].alias == contentProperty.alias) {
                        return true;
                    }
                }
                return false;
            },
            items: []
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


    //return the module
    return app;
    
});