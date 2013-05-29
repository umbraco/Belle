angular.module("umbraco").controller("Umbraco.Editors.DatepickerController", function ($rootScope, $scope, notifications, $timeout) {
    require(
        [
            'views/propertyeditors/umbraco/datepicker/bootstrap.datepicker.js',
            'css!/belle/views/propertyeditors/umbraco/datepicker/bootstrap.datepicker.css'
        ],
        function () {
            //The Datepicker js and css files are available and all components are ready to use.

            // Get the id of the datepicker button that was clicked
            var pickerId = $scope.model.alias;

            // Open the datepicker and add a changeDate eventlistener
            $("#" + pickerId).datepicker({
                format: "dd/mm/yyyy",
                autoclose: true
            }).on("changeDate", function (e) {
                // When a date is clicked the date is stored in model.value
                $scope.model.value = e.date;
            });
        }
    );
});
