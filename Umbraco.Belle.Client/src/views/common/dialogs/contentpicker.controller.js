//used for the media picker dialog
angular.module("umbraco").controller("Umbraco.Dialogs.ContentPickerController", function ($scope, mediaFactory) {	
	
	$scope.$on("treeNodeSelect", function(event, args){
		$(args.event.target.parentElement).find("i").attr("class", "icon umb-tree-icon sprTree icon-check blue");
		$scope.select(args.node);
	});
});