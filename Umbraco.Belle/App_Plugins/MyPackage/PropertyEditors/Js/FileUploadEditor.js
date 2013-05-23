'use strict';

//requires namespaceMgr
define(['namespaceMgr'], function () {
    
    Umbraco.Sys.registerNamespace("MyPackage.PropertyEditors");

    MyPackage.PropertyEditors.FileUploadEditor = function ($scope, $http, $filter) {
        
        $scope.file = null;

        //set up listeners for the object to write back to our comma delimited property value
        $scope.$watch('file', function (newValue, oldValue) {
            $scope.model.value = $scope.file;
        });

    };
    
});