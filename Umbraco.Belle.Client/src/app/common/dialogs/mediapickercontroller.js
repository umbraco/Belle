//used for the media picker dialog
app.controller("mediaPickerDialogController", function ($scope, mediaFactory) {	
	$scope.images = mediaFactory.rootMedia();
});