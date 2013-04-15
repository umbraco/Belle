'use strict';

define([ 'app'], function (app) {

	//Here we define the controller, and load the root media of the dialog
	app.controller("mediaPickerDialogController", function ($scope, $routeParams,mediaFactory) {	
		$scope.images = mediaFactory.rootMedia();
	});
	
	return app;
});


