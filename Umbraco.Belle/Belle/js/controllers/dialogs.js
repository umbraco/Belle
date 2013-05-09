'use strict';

define([ 'app'], function (app) {

	//used for the media picker dialog
	app.controller("mediaPickerDialogController", function ($scope, mediaFactory) {	
		$scope.images = mediaFactory.rootMedia();
	});
	
	//used for the macro picker dialog
	app.controller("macroPickerDialogController", function ($scope, macroFactory) {	
		$scope.macros = macroFactory.all(true);
		$scope.dialogMode = "list";

		$scope.configureMacro = function(macro){
			$scope.dialogMode = "configure";
			$scope.dialogData.macro = macroFactory.getMacro(macro.alias);
		};
	});

	app.controller("contentCreateDialogController", function ($scope, $routeParams,contentTypeFactory) {	
		$scope.allowedTypes  = contentTypeFactory.allowedTypes($scope.currentNode.id);	
	});

	return app;
});


