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


app.controller("GoogleMapsController", function ($rootScope, $scope, $notification) {
require(
    [
        'async!http://maps.google.com/maps/api/js?sensor=false'
    ],
    function () {
        //Google maps is available and all components are ready to use.
        var valueArray = $scope.property.value.split(',');
        var latLng = new google.maps.LatLng(valueArray[0], valueArray[1]);
        
        var mapDiv = document.getElementById($scope.property.alias + '_map');
        var mapOptions = {
            zoom: $scope.property.config.zoom,
            center: latLng,
            mapTypeId: google.maps.MapTypeId[$scope.property.config.mapType]
        };

        var map = new google.maps.Map(mapDiv, mapOptions);
        var marker = new google.maps.Marker({
            map: map,
            position: latLng,
            draggable: true
        });
        
        google.maps.event.addListener(marker, "dragend", function(e){
            var newLat = marker.getPosition().lat();
            var newLng = marker.getPosition().lng();
        
            //here we will set the value
            $scope.property.value = newLat + "," + newLng;

            //call the notication engine
            $rootScope.$apply(function () {
                $notification.warning("Your dragged a marker to", $scope.property.value);
            });
        });
    }
);    
});


app.controller("CodeMirrorController", function ($scope, $rootScope) {
    require(
        [
            'css!../lib/codemirror/js/lib/codemirror.css',
            'css!../lib/codemirror/css/umbracoCustom.css',
            'codemirrorHtml',
        ],
        function () {

            var editor = CodeMirror.fromTextArea(
                                    document.getElementById($scope.property.alias), 
                                    {
                                        mode: CodeMirror.modes.htmlmixed, 
                                        tabMode: "indent"
                                    });

            editor.on("change", function(cm) {
                $rootScope.$apply(function(){
                    $scope.property.value = cm.getValue();   
                });
            });

        });
});

	return app;
});

