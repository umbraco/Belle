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
                        scope.$parent.errors.removeError(scope.model);
                        ctrl.$setValidity('valRegex', true);
                        return viewValue;
                    }
                    else {
                        // it is invalid, return undefined (no model update)
                        scope.$parent.errors.addError(scope.model, "Invalid value");
                        ctrl.$setValidity('valRegex', false);
                        return undefined;
                    }
                });
            }
        };
    });

    Umbraco.Sys.registerNamespace("MyPackage.PropertyEditors");

    MyPackage.PropertyEditors.RegexEditor = function ($scope, $http, $filter) {
        
    };
});