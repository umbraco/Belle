app.controller("contentEditController", function ($scope, $routeParams, contentFactory, notifications) {

	if($routeParams.create)
		$scope.content = contentFactory.getContentScaffold($routeParams.parentId, $routeParams.doctype);
	else
		$scope.content = contentFactory.getContent($routeParams.id);


	$scope.saveAndPublish = function (cnt) {
		cnt.publishDate = new Date();
		contentFactory.publishContent(cnt);

		notifications.success(cnt.name + " published", "");
	};

	$scope.save = function (cnt) {
		cnt.updateDate = new Date();
		contentFactory.saveContent(cnt);

		notifications.success(cnt.name + " saved", "");
	};
	
});