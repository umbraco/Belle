angular.module('umbraco.resources.contentType', [])
.factory('contentTypeFactory', function () {
    return {

        //return all availabel types
        all: function(){
            return [];
        },

        //return children inheriting a given type
        children: function(id){
            return [];
        },

        //return all content types a type inherite from
        parents: function(id){
            return [];
        },

        //return all types allowed under given document
        allowedTypes: function(documentId){
          return [
          {name: "News Article", description: "Standard news article", alias: "newsArticle", id: 1234, cssClass:"file"},
          {name: "News Area", description: "Area to hold all news articles, there should be only one", alias: "newsArea", id: 1234, cssClass:"suitcase"},
          {name: "Employee", description: "Employee profile information page",  alias: "employee", id: 1234, cssClass:"user"}
          ];
      }
  };
});