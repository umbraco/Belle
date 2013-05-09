function ComplexEditorController($scope, $http) {

    $scope.properties = [
        {
            alias: "numbers",
            label: "Numeric",
            description: "Enter a numeric value",
            view: "/App_Plugins/MyPackage/PropertyEditors/numeric.html",
            value: "12345987765",
            config: {
                format: "## #### ####"
            }
        },
        {
            alias: "serverEnvironment",
            label: "Server Info",
            description: "Some server information",
            view: "@(serverEnvironmentView)",
            value: ""
        }
    ];

    $scope.save = function () {
        var valueToPost = [];
        for (var p in $scope.properties) {
            valueToPost.push({
                alias: $scope.properties[p].alias,
                value: $scope.properties[p].value
            });
        }
        $http.post('@(postSaveUrl)', valueToPost).
            success(function (data, status, headers, config) {
                alert("success!");
            }).
            error(function (data, status, headers, config) {
                alert("failed!");
            });
    };

}