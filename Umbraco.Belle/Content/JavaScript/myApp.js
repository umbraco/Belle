'use strict';

define(['angular', 'namespaceMgr'], function (angular) {

    // declare and return the app module
    var app = angular.module('myApp', ['uModules.Content.Helpers']);

    Umbraco.Sys.registerNamespace("Umbraco.Content");

    var contentHelpers = angular.module('uModules.Content.Helpers', []);

    //TODO: Need to create a directive for fields to subscribe to that invalidates the field based on 
    // the property's $parent erorrs collection (based on alias)
    // This will allow us to automatically invalidate the particular field on alias which will work based
    // on our server side ModelState collection with field names.

    app.directive('valServerProperty', [
        function() {
            return {
                link: function(scope, element, attr, ctrl) {
                    if (!scope.model || !scope.model.alias)
                        throw "valServerProperty can only be used with a content property object";
                    var parentErrors = scope.$parent.errors;
                    if (!parentErrors) return;
                    var fieldName = attr.valServerProperty;
                    if (!fieldName)
                        throw "valServerProperty must have a field name specified";
                    parentErrors.subscribe(scope.model, fieldName, function (errors) {
                        var asdf = "";
                    }, true);
                }
            };
        }
    ]);
    
    app.directive('valContentProperty', [
        function () {
            return {
                link: function (scope, element, attr, ctrl) {

                    //copy local to use in the watch
                    var _element = element;
                    var _scope = scope;

                    //listen for form invalidation, NOTE: we must use the 'string' value of 'form.$valid', we cannot
                    // listen on the real object like scope.form.$valid... this doesn't work for some reason.
                    //NOTE: we get the form element containing this element so we are not hard coding the reference 
                    // to our form.
                    var formName = element.closest("form").attr("name");
                    
                    scope.$watch(formName + '.$valid', function (newValue, oldValue) {
                        if (newValue === false) {                        
                            $(_element).show();
                        }
                        else {
                            $(_element).hide();
                        }
                    });

                }
            };
        }
    ]);

    app.directive('valSummary', [
        function () {
            return {
                link: function (scope, element, attr, ctrl) {

                    var valSummary = [];
                    //assign this model to the scope
                    scope.validationSummary = valSummary;

                    //copy local to use in the watch
                    var _element = element;
                    var _scope = scope;
                    
                    //listen for form invalidation, NOTE: we must use the 'string' value of 'form.$valid', we cannot
                    // listen on the real object like scope.form.$valid... this doesn't work for some reason.
                    //NOTE: we get the form element containing this element so we are not hard coding the reference 
                    // to our form.
                    var formName = element.closest("form").attr("name");
                    scope.$watch(formName + '.$valid', function (newValue, oldValue) {
                        if (newValue === false) {                            
                            //clear the summary
                            valSummary = [];
                            var processed = [];
                            for (var err in _scope[formName].$error) {
                                for (var i in err) {
                                    //TODO: We should check here if we've processed the error, if not add it to the valSummary.
                                    
                                    // each err[i] has a $name and a $viewValue so we will check for this in our processed object
                                    // then we can update the valSummary item to say something like: 
                                    // 'value {$viewValue} is invalid for field {$name}
                                    
                                }
                            }                            
                            $(_element).show();
                        }
                        else {
                            $(_element).hide();
                        }
                    });
                    
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
    
    contentHelpers.factory('u$ValidationManager', function () {

        return {
            _callbacks: [],
            subscribe: function (contentProperty, fieldName, callback) {
                /// <summary>
                /// Adds a callback method that is executed whenever validation changes for the field name + property specified.
                /// This is generally used for server side validation in order to match up a server side validation error with 
                /// a particular field, otherwise we can only pinpoint that there is an error for a content property, not the 
                /// property's specific field. This is used with the val-server directive in which the directive specifies the 
                /// field alias to listen for.
                /// </summary>
                
                for (var c in this._callbacks) {
                    if (this._callbacks[c].propertyAlias == contentProperty.alias && this._callbacks[c].fieldName == fieldName) {
                        throw "A subscription has already been made for content alias " + contentProperty.alias + " and field name " + fieldName;
                    }                    
                }
                this._callbacks.push({ propertyAlias: contentProperty.alias, fieldName: fieldName, callback: callback });
            },
            getCallback: function (contentProperty, fieldName) {
                /// <summary>Gets a callback that has been registered using the subscribe method</summary>
                for (var c in this._callbacks) {
                    if (this._callbacks[c].propertyAlias == contentProperty.alias && this._callbacks[c].fieldName == fieldName) {
                        return this._callbacks[c].callback;
                    }
                }
                return null;
            },
            addError: function (contentProperty, fieldName, errorMsg) {
                /// <summary>Adds an error message for the content property</summary>
                
                if (!contentProperty) return;
                //only add the item if it doesn't exist                
                if (!this.hasError(contentProperty)) {
                    this.items.push({
                        propertyAlias: contentProperty.alias,
                        fieldName: fieldName,
                        errorMsg: errorMsg
                    });                    
                }
            },
            removeError: function (contentProperty, fieldName) {
                /// <summary>Removes an error message for the content property</summary>

                if (!contentProperty) return;
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].propertyAlias == contentProperty.alias && this.items[i].fieldName == fieldName) {
                        this.items.splice(i, 1); //remove the item
                        break;
                    }
                }
            },
            getError: function (contentProperty) {
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].propertyAlias == contentProperty.alias) {
                        return this.items[i].errorMsg;
                    }
                }
                return null;
            },
            hasError: function (contentProperty) {
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].propertyAlias == contentProperty.alias) {
                        return true;
                    }
                }
                return false;
            },
            items: []
        };
    });
    
    Umbraco.Content.ContentController = function ($scope, $element, $http, u$ContentHelper, u$ValidationManager) {
        
        //initialize the data model
        $scope.model = {};
        //expose the current form name
        $scope.formName = $element.closest("form").attr("name");
        //model for updating the UI
        $scope.ui = {
            working: false,
            canSubmit: function () {
                //NOTE: we're getting the form element for the current element so we're not hard coding
                // the reference to the form name here.
                return $scope[$element.closest("form").attr("name")].$invalid || $scope.ui.working;
            }
        };
        //wire up validation manager
        $scope.errors = u$ValidationManager;        

        //the url to get the content from
        var getContentUrl = Umbraco.Sys.ServerVariables.contentEditorApiBaseUrl + "GetContent?id=" + 1;
        var saveContentUrl = Umbraco.Sys.ServerVariables.contentEditorApiBaseUrl + "PostSaveContent";

        //copy local so we can use in the http callback below (NOTE: This is a jquery element)
        var elem = $($element);

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