angular.module("umbraco").controller("Umbraco.Editors.ContentEditController", function ($scope, $routeParams, contentFactory, notifications) {
	
	if($routeParams.create)
		$scope.content = contentFactory.getContentScaffold($routeParams.parentId, $routeParams.doctype);
	else
		$scope.content = contentFactory.getContent($routeParams.id);


	$scope.saveAndPublish = function (cnt) {
		cnt.publishDate = new Date();
		contentFactory.publishContent(cnt);

		notifications.success("Published", "Content has been saved and published");
	};

	$scope.save = function (cnt) {
		cnt.updateDate = new Date();

		contentFactory.saveContent(cnt);
		notifications.success("Saved", "Content has been saved");
	};
	
});