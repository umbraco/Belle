angular.module('umbraco.resources.localization', [])
.factory('localizationFactory', function () {
  var localizationArray = [];

  var factory = {
    _cachedItems: localizationArray,
    getLabels: function (language) {
      /* 
        Fetch from JSON object according to users language settings
        $http.get('model.:language.json') ish solution
       */
      var labels = {
        app: {
          typeToSearch: "Type to search"
        },
        content: {
          modelName: "Content",
          contextMenu: {
            createPageLabel: "Create a page under %name"
          }
        }
      };

      return labels;
    }
  };
  return factory;
}); 