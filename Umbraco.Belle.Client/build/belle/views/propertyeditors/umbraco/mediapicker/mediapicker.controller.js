//this controller simply tells the dialogs service to open a mediaPicker window
//with a specified callback, this callback will receive an object with a selection on it
angular.module('umbraco').controller("mediaPickerController", function($rootScope, $scope, dialog){
    $scope.openMediaPicker =function(value){
            var d = dialog.mediaPicker({scope: $scope, callback: populate});
    };

    function populate(data){
        $scope.model.value = data.selection;    
    }
});