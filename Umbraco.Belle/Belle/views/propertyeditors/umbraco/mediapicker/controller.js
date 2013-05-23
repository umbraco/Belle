'use strict';

define(['app'], function (app) {

    //this controller simply tells the dialogs service to open a mediaPicker window
    //with a specified callback, this callback will receive an object with a selection on it
    app.controller("mediaPickerController", function($rootScope, $scope, $dialog){
        $scope.openMediaPicker =function(value){
                var dialog = $dialog.mediaPicker({scope: $scope, callback: populate});
        };

        function populate(data){
            $scope.property.value = data.selection;    
        }
    });

	return app;
});

