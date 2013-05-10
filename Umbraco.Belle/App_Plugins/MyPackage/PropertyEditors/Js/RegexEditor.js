'use strict';

define(['angular', 'myApp', 'namespaceMgr'], function (angular, app) {

    angular.module('time', [])
        // Register the 'myCurrentTime' directive factory method.
        // We inject $timeout and dateFilter service since the factory method is DI.
        .directive('myCurrentTime', function($timeout, dateFilter) {
            // return the directive link function. (compile function not needed)
            return function(scope, element, attrs) {
                var format, // date format
                    timeoutId; // timeoutId, so that we can cancel the time updates

                // used to update the UI

                function updateTime() {
                    element.text(dateFilter(new Date(), format));
                }

                
                // watch the expression, and update the UI on change.
                scope.$watch(attrs.myCurrentTime, function(value) {
                    format = value;
                    updateTime();
                });

                // schedule update in one second

                function updateLater() {
                    // save the timeoutId for canceling
                    timeoutId = $timeout(function() {
                        updateTime(); // update DOM
                        updateLater(); // schedule another update
                    }, 1000);
                }

                // listen on DOM destroy (removal) event, and cancel the next UI update
                // to prevent updating time after the DOM element was removed.
                element.bind('$destroy', function() {
                    $timeout.cancel(timeoutId);
                });

                updateLater(); // kick off the UI update process.
            };
        });

    app.directive('regex', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                    alert(viewValue);
                    //if (INTEGER_REGEXP.test(viewValue)) {
                    //    // it is valid
                    //    ctrl.$setValidity('integer', true);
                    //    return viewValue;
                    //} else {
                    //    // it is invalid, return undefined (no model update)
                    //    ctrl.$setValidity('integer', false);
                    //    return undefined;
                    //}
                });
            }
        };
    });

    Umbraco.Sys.registerNamespace("MyPackage.PropertyEditors");

    MyPackage.PropertyEditors.RegexEditor = function ($scope, $http, $filter) {

        var values = [];

        //this will be comma delimited
        if ($scope.model && $scope.model.value && (typeof $scope.model.value == "string")) {
            var splitVals = $scope.model.value.split(",");
            //set the values of our object
            for (var i = 0; i < splitVals.length; i++) {
                values.push({
                    index: i,
                    value: splitVals[i].trim()
                });
            }
        }

        //set the scope values to bind on our view to the new object
        $scope.values = values;

        //set up listeners for the object to write back to our comma delimited property value
        $scope.$watch('values', function (newValue, oldValue) {
            var csv = [];
            for (var v in newValue) {
                csv.push(newValue[v].value);
            }
            //write the csv value back to the property
            $scope.model.value = csv.join();
        }, true);

    };
});