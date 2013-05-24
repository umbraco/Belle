angular.module("umbraco")
    .controller("Umbraco.Editors.RTEController", 
    function($rootScope, $scope, dialog, $log){
    require(
        [
            'tinymce'
        ],
        function (tinymce) {

            tinymce.DOM.events.domLoaded = true;
            $log.log("dom loaded");

            
            tinymce.init({
                selector: "#" + $scope.model.alias + "_rte",
                skin: "umbraco",
                menubar : false,
                statusbar: false,
                height: 340,
                toolbar: "bold italic | styleselect | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | link image"
            });


            $scope.openMediaPicker =function(value){
                    var d = dialog.mediaPicker({scope: $scope, callback: populate});
            };

            function bindValue(inst){
                $log.log("woot");

                $scope.$apply(function(){
                    $scope.model.value = inst.getBody().innerHTML;
                })
            }

            function myHandleEvent(e){
                $log.log(e);
            }

            function populate(data){
                $scope.model.value = data.selection;    
            }

        });
});