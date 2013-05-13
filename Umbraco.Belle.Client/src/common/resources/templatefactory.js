angular.module('umb.resources.template', [])
.factory('templateFactory', function () {
	return {
		getTemplate: function (id) {
			var t = {
				name: "Master",
				id: id,
				path: "/Views/master.cshtml",
				parent: "",
				content: "<p>Hello</p>"
			};

			return t;
		},
		storeTemplate: function (template) {

		},
		deleteTemplate: function (id) {

		}
	};
});