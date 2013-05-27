angular.module("umbraco").controller("Umbraco.Editors.GoogleMapsController", function ($rootScope, $scope, notifications, $timeout) {
    require(
        [
            'async!http://maps.google.com/maps/api/js?sensor=false'
        ],
        function () {
            //Google maps is available and all components are ready to use.
            var valueArray = $scope.model.value.split(',');
            var latLng = new google.maps.LatLng(valueArray[0], valueArray[1]);
            
            var mapDiv = document.getElementById($scope.model.alias + '_map');
            var mapOptions = {
                zoom: $scope.model.config.zoom,
                center: latLng,
                mapTypeId: google.maps.MapTypeId[$scope.model.config.mapType]
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
                $scope.model.value = newLat + "," + newLng;

                //call the notication engine
                $rootScope.$apply(function () {
                    notifications.warning("Your dragged a marker to", $scope.model.value);
                });
            });

            google.maps.event.addListenerOnce(map, 'idle', function() {
                google.maps.event.trigger(map, 'resize');
            });


            $timeout(function(){
                //fixes the maps resize issue due to dynamic loading
                google.maps.event.trigger(map, "resize");   
            }, 2000);
        }
    );    
});