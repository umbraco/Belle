//used for the media picker dialog
angular.module('umbraco').controller("mediaPickerDialogController", function ($scope, mediaFactory) {	
	$scope.images = mediaFactory.rootMedia();
});