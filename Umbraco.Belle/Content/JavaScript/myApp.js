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

    //This directive is used to associate a field with a server-side validation response
    // so that the validators in angular are updated based on server-side feedback.
    app.directive('valServerProperty', [
        function() {
            return {
                restrict: "A",
                link: function(scope, element, attr, ctrl) {
                    if (!scope.model || !scope.model.alias)
                        throw "valContentProperty can only be used in the scope of a content property object";
                    var parentErrors = scope.$parent.errors;
                    if (!parentErrors) return;
                    var fieldName = attr.valServerProperty;
                    parentErrors.subscribe(scope.model, fieldName, function (propertyErrors, allErrors) {
                        alert("ERROR!");
                    }, true);
                }
            };
        }
    ]);
    
    //This directive is used to control the display of the property level validation message.
    // We will listen for server side validation changes based on the parent scope's error collection
    // and when an error is detected for this property we'll show the error message and then we need 
    // to emit the valBubble event so that any parent listening can update it's UI (like the validation summary)
    app.directive('valContentProperty', [
        function () {
            return {
                restrict: "A",
                link: function (scope, element, attr, ctrl) {

                    //we'll validate a bunch of inputs here to ensure this directive can execute.
                    if (!scope.$parent || !scope.$parent.formName)
                        throw "valContentProperty must exist within a scope of a content editor";

                    //create flags for us to be able to reference in the below closures for watching.
                    var showValidation = false;
                    var hasError = false;
                    
                    //listen for form validation
                    //NOTE: we are not hard coding the form name, we'll get it from the parent scope
                    scope.$watch("$parent[$parent.formName].$valid", function (isValid, oldValue) {
                        if (!isValid) {
                            //check if it's one of the properties that is invalid in the current content property
                            if (element.closest(".content-property").find(".ng-invalid").length > 0) {
                                hasError = true;
                                if (showValidation) {
                                    element.show();
                                }                                
                            }
                            else {
                                hasError = false;
                                element.hide();
                            }
                        }
                        else {
                            hasError = false;
                            element.hide();
                        }
                    });
                    
                    //add a watch to update our waitingOnValidation flag for use in the above closure
                    scope.$watch("$parent.ui.waitingOnValidation", function (isWaiting, oldValue) {
                        showValidation = isWaiting;
                        if (hasError && showValidation) {
                            element.show();
                        }
                        else {
                            element.hide();
                        }
                    });
                    
                    var parentErrors = scope.$parent.errors;
                    if (!parentErrors) return;
                    //NOTE: we pass in "" in order to listen for all validation changes to the content property, not for
                    // validation changes to fields in the property this is because some server side validators may not
                    // return the field name for which the error belongs too, just the property for which it belongs.
                    parentErrors.subscribe(scope.model, "", function (propertyErrors, allErrors) {
                        hasError = true;
                        element.show();
                        //emit an event upwards 
                        scope.$emit("valBubble", {
                            element: element,       // the element that the validation applies to
                            scope: scope,           // the current scope
                            ctrl: ctrl              // the current controller
                        });
                    }, true);

                }
            };
        }
    ]);

    //This directive will show/hide an error based on:
    // * is the value + the given validator invalid
    // * AND, has the form been submitted ?
    app.directive('valToggleError', [
        function () {
            return {
                restrict: "A",
                link: function (scope, element, attr, ctrl) {

                    //we'll validate a bunch of inputs here to ensure this directive can execute.
                    if (!scope.$parent || !scope.$parent.formName)
                        throw "valToggleError must exist within a scope of a content editor";                    
                    var parts = attr.valToggleError.split(";");
                    if (parts.length != 2)
                        throw "valToggleError value must have 2 parts delimited by a semi colon";
                    var currentForm = scope.$parent[scope.$parent.formName];
                    var value = currentForm[parts[0]];
                    if (!value)
                        throw "valToggleError could not find the value " + parts[0];
                    
                    //create a flag for us to be able to reference in the below closures for watching.
                    var showValidation = false;
                    var hasError = false;

                    //add a watch to the validator for the value (i.e. $parent.myForm.value.$error.required )
                    //NOTE: we are not hard coding the form name, we'll get it from the parent scope
                    scope.$watch("$parent[$parent.formName]." + parts[0] + ".$error." + parts[1], function (isInvalid, oldValue) {
                        hasError = isInvalid;
                        if (hasError && showValidation) {
                            element.show();
                        }
                        else {
                            element.hide();
                        }
                    });

                    //add a watch to update our waitingOnValidation flag for use in the above closure
                    scope.$watch("$parent.ui.waitingOnValidation", function (isWaiting, oldValue) {
                        showValidation = isWaiting;
                        if (hasError && showValidation) {
                            element.show();
                        }
                        else {
                            element.hide();
                        }                        
                    });
                }
            };
        }
    ]);
    
    //This directive will bubble up a notification via an emit event (upwards)
    // describing the state of the validation element. This is useful for 
    // parent elements to know about child element validation state.
    app.directive('valBubble', [
        function () {
            return {
                restrict: "A",
                link: function (scope, element, attr, ctrl) {

                    //we'll validate a bunch of inputs here to ensure this directive can execute.
                    if (!scope.$parent || !scope.$parent.formName)
                        throw "valBubble must exist within a scope of a content editor";
                   
                    if (!attr.name) {
                        throw "valBubble must be set on an input element that has a 'name' attribute";
                    }

                    //we're going to add a watch to all potential validators based on the attributes applied
                    //one the element itself (ignoring any attributes in the collection starting with '$')
                    for (var a in attr) {
                        //add a watch to the validator for the value (i.e. $parent.myForm.value.$error.required )
                        //NOTE: we are not hard coding the form name, we'll get it from the parent scope
                        if (a.substr(0, 1) != "$") {
                            scope.$watch("$parent[$parent.formName]." + attr.name + ".$error." + a, function (newValue, lastValue) {
                                if (newValue) {
                                    //emit an event upwards 
                                    scope.$emit("valBubble", {
                                        element: element,       // the element that the validation applies to
                                        expression: this.exp,   // the expression that was watched to check validity
                                        scope: scope,           // the current scope
                                        ctrl: ctrl              // the current controller
                                    });
                                }
                            });
                        }
                    }
                }
            };
        }
    ]);

    //This directive will display a validation summary for the current form based on the 
    //content properties of the current content item.
    app.directive('valSummary', [
        function () {
            return {
                scope:      true,   // create a new scope for this directive
                replace:    true,   // replace the html element with the template
                restrict:   "E",    // restrict to an element
                template:   '<ul class="validation-summary"><li ng-repeat="model in validationSummary">{{model}}</li></ul>',
                link: function (scope, element, attr, ctrl) {

                    //we'll validate a bunch of inputs here to ensure this directive can execute.
                    if (!scope.$parent || !scope.$parent.formName)
                        throw "valSummary must exist within a scope of an editor";

                    //create a property on our scope
                    scope.validationSummary = [];

                    //create a flag for us to be able to reference in the below closures for watching.
                    var showValidation = false;
                    
                    //add a watch to update our waitingOnValidation flag for use in the below closures
                    scope.$watch("$parent.ui.waitingOnValidation", function (isWaiting, oldValue) {
                        showValidation = isWaiting;
                        if (scope.validationSummary.length > 0 && showValidation) {
                            element.show();
                        }
                        else {
                            element.hide();
                        }
                    });

                    if (!attr.behavior || attr.behavior == "properties") {
                        //if we are to show field property based errors.
                        //this requires listening for bubbled events from valBubble directive.
                                                
                        scope.$parent.$on("valBubble", function (evt, args) {
                            //In order to show that a property has an error, we need to check where the element exists in the DOM
                            // for the validation error that occurred.
                            var contentPropElement = args.element.closest(".content-property");
                            //now get the scope for that property
                            var contentPropScope = contentPropElement.scope();
                            //with the scope we can get all of the props of the model like alias/label
                            var exists = false;
                            var msg = "The value assigned for the property " + contentPropScope.model.label + " is invalid";
                            for (var v in scope.validationSummary) {
                                if (msg == scope.validationSummary[v]) {
                                    exists = true;
                                }
                            }
                            if (!exists) {
                                scope.validationSummary.push(msg);
                            }
                            if (showValidation) {
                                element.show();
                            }                            
                        });
                        //listen for form invalidation so we know when to hide it
                        //NOTE: we are not hard coding the form name, we'll get it from the parent scope
                        scope.$watch("$parent[$parent.formName].$error", function(errors) {
                            //check if there is an error and hide the summary if not
                            var hasError = false;
                            for (var err in errors) {
                                if (errors[err].length && errors[err].length > 0) {
                                    hasError = true;
                                }
                            }
                            if (!hasError) {
                                element.hide();
                            }
                        }, true);                        
                    }                    
                    else if (attr.behavior && attr.behavior == "fields") {
                        //if we are to show field based errors

                        //listen for form invalidation
                        //NOTE: we are not hard coding the form name, we'll get it from the parent scope
                        scope.$watch("$parent[$parent.formName].$error", function (errors) {
                            //clear the summary
                            scope.validationSummary = [];
                            for (var err in errors) {
                                if (errors[err].length && errors[err].length > 0) {
                                    scope.validationSummary.push("The value '"
                                        + errors[err][0].$viewValue
                                        + "' is invalid for field '"
                                        + errors[err][0].$name
                                        + "'"
                                    );
                                }
                            }

                            if (scope.validationSummary.length > 0 && showValidation) {
                                element.show();
                            }
                            else {
                                element.hide();
                            }

                        }, true);
                    }                    
                    
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
                
                this._callbacks.push({ propertyAlias: contentProperty.alias, fieldName: fieldName, callback: callback });
            },
            getCallbacks: function (contentProperty, fieldName) {
                /// <summary>Gets all callbacks that has been registered using the subscribe method for the contentProperty + fieldName combo</summary>
                var found = [];
                for (var c in this._callbacks) {
                    if (this._callbacks[c].propertyAlias == contentProperty.alias && this._callbacks[c].fieldName == fieldName) {
                        found.push(this._callbacks[c].callback);
                    }
                }
                return found;
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
                
                //we should now call all of the call backs registered for this error
                var callbacks = this.getCallbacks(contentProperty, fieldName);
                var errorsForCallback = [];
                for (var e in this.items) {
                    if (this.items[e].propertyAlias == contentProperty.alias && this.items[e].fieldName == fieldName) {
                        errorsForCallback.push(this.items[e]);
                    }
                }
                for (var cb in callbacks) {
                    callbacks[cb].apply(this, errorsForCallback, this.items);
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
                
                //TODO: we somehow need to display the server error message after posting, but then
                // after re-validation on the client side what do we display ?
                // perhaps we need to figure out a way to handle the bubble up event of the field error and
                // display that error instead? 
                // TODO: Currently we are not bubbling up the error message... how can we do this nicely ?
                //  how can we get the error message from the element which simply just displays text when validation changes... it is not bound to the element being validated.

                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].propertyAlias == contentProperty.alias) {
                        return this.items[i].errorMsg;
                    }
                }
                //return generic property error message
                return "Property has errors";
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
            formFailed: false,
            canSubmit: function () {
                //NOTE: we're getting the form element for the current element so we're not hard coding
                // the reference to the form name here.
                //return $scope[$element.closest("form").attr("name")].$valid || !$scope.ui.working;
                return !$scope.ui.working;
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

            //flag that is set informing the validation controls to be displayed if any are in error
            $scope.ui.waitingOnValidation = true;
            
            //don't continue if the form is invalid
            if ($scope[$scope.formName].$invalid) return;
            
            $scope.ui.working = true;
            
            $http.post(saveContentUrl, u$ContentHelper.formatPostData($scope.model)).
                success(function (data, status, headers, config) {
                    alert("success!");
                    $scope.ui.working = false;
                    $scope.ui.waitingOnValidation = false;
                }).
                error(function (data, status, headers, config) {
                    //When the status is a 403 status, we have validation errors.
                    //Otherwise the error is probably due to invalid data (i.e. someone mucking around with the ids or something).
                    //Or, some strange server error
                    if (status == 403) {
                        //now we need to look through all the validation errors
                        if (data && data.ModelState) {
                            for (var e in data.ModelState) {

                                //find the content property for the current error
                                var contentProperty = null;
                                for (var p in $scope.model.properties) {
                                    if ($scope.model.properties[p].alias == e) {
                                        contentProperty = $scope.model.properties[p];
                                        break;
                                    }
                                }
                                if (contentProperty != null) {
                                    //if it contains a '.' then we will wire it up to a property's field
                                    if (e.indexOf(".") >= 0) {
                                        $scope.errors.addError(contentProperty, "", data.ModelState[e][0]);
                                    }
                                    else {
                                        $scope.errors.addError(contentProperty, "", data.ModelState[e][0]);
                                    }
                                }
                            }

                        }
                    }
                    else {
                        alert("failed!");
                    }
                    
                    $scope.ui.working = false;
                    $scope.ui.waitingOnValidation = true;
                });
        };

    };


    //return the module
    return app;
    
});