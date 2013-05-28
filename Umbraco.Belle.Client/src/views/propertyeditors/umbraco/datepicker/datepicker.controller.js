angular.module("umbraco").controller("Umbraco.Editors.DatepickerController", function ($rootScope, $scope, notifications, $timeout) {
    require(
        [
            'views/propertyeditors/umbraco/datepicker/bootstrap.datepicker.js'
        ],
        function () {
        	var pickerId = $scope.model.alias;

        	$("#" + pickerId).datepicker({
        		format: "dd/mm/yyyy",
        		autoclose: true
        	}).on("changeDate", function (e) {
				$scope.model.value = e.date;
        	});
        }
    );
});