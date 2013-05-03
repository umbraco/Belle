'use strict';

define([ 'app'], function (app) {

	app.controller("ContentEditController", function ($scope, $routeParams, contentFactory) {
		if($routeParams.create)
			$scope.content = contentFactory.getContentScaffold($routeParams.parentId, $routeParams.doctype);
		else
			$scope.content = contentFactory.getContent($routeParams.id);

		$scope.saveAndPublish = function (cnt) {
			cnt.publishDate = new Date();
			contentFactory.publishContent(cnt);
		};

		$scope.save = function (cnt) {
			cnt.updateDate = new Date();
			contentFactory.saveContent(cnt);
		};

		$scope.getView = function (viewType) {
			return "views/propertyeditors/" + viewType.replace('.','/') + "/editor.html";
		};
	});


	app.controller("SettingsTemplateController", function ($scope, $routeParams, templateFactory) {


	});

	return app;
});


