angular.module('umbraco.services.section', [])
.factory('section', function ($rootScope) {

	var currentSection = "content";
	return {
		all: function(){
			return [
			{ name: "Content", cssclass: "content", alias: "content" },
			{ name: "Media", cssclass: "media", alias: "media" },
			{ name: "Settings", cssclass: "settings",  alias: "settings" },
			{ name: "Developer", cssclass: "developer", alias: "developer" },
			{ name: "Users", cssclass: "user", alias: "users" }
			];	
		},
		
		setCurrent: function(sectionAlias){
			currentSection = sectionAlias;	
		}
	};

});