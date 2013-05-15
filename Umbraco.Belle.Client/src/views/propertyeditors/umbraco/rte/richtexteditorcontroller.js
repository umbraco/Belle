angular.module('umbraco').controller("RichTextEditorController", function($rootScope, $scope, dialog, $log){
    require(
        [
            'tinymce'
        ],
        function (tinymce) {

            tinymce.DOM.events.domLoaded = true;

            tinymce.init({
               selector: "#" + $scope.property.alias,
               handle_event_callback : "myHandleEvent" 
             });
        
            $scope.openMediaPicker =function(value){
                    var d = dialog.mediaPicker({scope: $scope, callback: populate});
            };

            function bindValue(inst){
                $log.log("woot");

                $scope.$apply(function(){
                    $scope.property.value = inst.getBody().innerHTML;
                })
            }

            function myHandleEvent(e){
                $log.log(e);
            }

            function populate(data){
                $scope.property.value = data.selection;    
            }

        });
});