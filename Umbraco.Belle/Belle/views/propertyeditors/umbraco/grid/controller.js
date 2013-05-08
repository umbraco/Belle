'use strict';

define(['app'], function (app) {

//this controller simply tells the dialogs service to open a mediaPicker window
//with a specified callback, this callback will receive an object with a selection on it
app.controller("GridController", function($rootScope, $scope, $dialog, $log){
    //we most likely will need some iframe-motherpage interop here
    $log.log("loaded");

    $scope.openMediaPicker =function(){
            var dialog = $dialog.mediaPicker({scope: $scope, callback: populate});
    };

    function populate(data){
        //notify iframe to render something.. 
    }
       
    $(window).bind("umbraco.grid.click", function(event){
        $scope.$apply(function () {
            $scope.openMediaPicker();
        });
    })
});

	return app;
});

