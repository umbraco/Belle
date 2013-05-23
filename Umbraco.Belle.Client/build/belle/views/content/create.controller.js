angular.module('umbraco').controller("Umbraco.Editors.ContentCreateController", function ($scope, $routeParams,contentTypeFactory) {	
	$scope.allowedTypes  = contentTypeFactory.getAllowedTypes($scope.currentNode.id);	
});