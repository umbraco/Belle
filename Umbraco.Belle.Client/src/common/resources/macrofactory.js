angular.module('umbraco.resources.macro', [])
.factory('macroFactory', function () {
    
    return {

        //returns a list of all available macros
        //if a boolean is passed it will restrict the list 
        //to macros allowed in the RTE
        all: function(restrictToEditorMacros){
          return[
              {name: "News List", description: "Standard news article", alias: "newsList"},
              {name: "Gallery", description: "Area to hold all news articles, there should be only one", alias: "gallery"},
              {name: "Employee", description: "Employee profile information page",  alias: "employee"}
          ];
        },

        //gets the complete macro with all properties
        getMacro: function(macroAlias){
           return{
                name: "News List",
                alias: "newsList",
                render: true,
                useInEditor: true,
                properties:[
                    {label: "Body Text", alias: "body", view: "umbraco.rte"},
                    {label: "Media Picker", alias: "nodeId", view: "umbraco.mediapicker"},
                    {label: "string", alias: "str", view: "umbraco.textstring"}
                ]
            };
        },

        //calls the server to render the macro and return the HTML
        //a <umbraco:macro> element or a macro json object can be passed
        renderMacro: function(macro, pageId){
            var html = $("<div><h1> BOOM: " + macro.name + "</h1></div>");
            var list = $("<ul></ul>");

            $.each(macro.properties, function(i, prop){
                list.append("<li>" + prop.label + ":" + prop.value + "</li>");
            });

            return html.append(list)[0].outerHTML;
        }
    };
});