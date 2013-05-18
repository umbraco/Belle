'use strict';

define(['myApp'], function (app) {
    
    app.directive('valRegex', function () {

        /// <summary>
        ///     A custom directive to allow for matching a value against a regex string.
        ///     NOTE: there's already an ng-pattern but this requires that a regex expression is set, not a regex string
        ///</summary>

        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {

                var regex = new RegExp(scope.$eval(attrs.valRegex));

                ctrl.$parsers.unshift(function (viewValue) {
                    if (regex.test(viewValue)) {
                        // it is valid
                        ctrl.$setValidity('valRegex', true);
                        return viewValue;
                    }
                    else {
                        // it is invalid, return undefined (no model update)
                        ctrl.$setValidity('valRegex', false);
                        return undefined;
                    }
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