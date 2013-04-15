'use strict';

//require.js dependency handling
define(['app'], function (app) {

    /*****
          CONTENT, (injects the notification factory)
      ****/
    app.factory('contentFactory', function ($notifications) {
        var contentArray = new Array();

        return {
            getContent: function (id) {

                if (contentArray[id] != undefined)
                    return contentArray[id];

                var content = {
                    name: "My content with id: " + id,
                    updateDate: new Date(),
                    publishDate: new Date(),
                    id: id,
                    tabs: [
                        {
                            label: "Tab 1",
                            alias: "tab01",
                            properties: [
                                { alias: "bodyText", label: "Body Text", description:"Here you enter the primary article contents", view: "umbraco.rte", value: "<p>askjdkasj lasjd</p>" },
                                { alias: "textarea", label: "textarea", view: "umbraco.textarea", value: "ajsdka sdjkds", config: { rows: 4 } },
                                { alias: "map", label: "Map", view: "umbraco.googlemaps",    value: "37.4419,-122.1419", config: { mapType: "ROADMAP", zoom: 4 } },
                                { alias: "upload", label: "Upload file", view: "umbraco.fileupload", value: "" },
                                { alias: "media", label: "Media picker", view: "umbraco.mediapicker", value: "" }
                            ]
                        },
                        {
                            label: "Tab 2",
                            alias: "tab02",
                            properties: [
                                { alias: "bodyText", label: "Meta Text", view: "umbraco.rte", value: "<p>askjdkasj lasjd</p>" },
                                { alias: "textarea", label: "Description", view: "umbraco.textarea", value: "ajsdka sdjkds", config: { rows: 7 } },
                                { alias: "dropdown", label: "Keywords", view: "umbraco.dropdown", value: "aksjdkasjdkj" },
                                { alias: "upload", label: "Upload file", view: "umbraco.fileupload", value: "" },
                                { alias: "code", label: "Codemirror", view: "umbraco.code", value: "test" }
                                
                            ]
                        }
                    ]
                };

                return content;
            },

            saveContent: function (content) {
                contentArray[content.id] = content;
                $notifications.success(content.name + " saved", "");

                //alert("Saved: " + JSON.stringify(content));
            },

            publishContent: function (content) {
                contentArray[content.id] = content;
                $notifications.success(content.name + " published", "");
            }

        };
    });


    app.factory('mediaFactory', function ($notifications) {
        var mediaArray = new Array();

        return {

            rootMedia: function(){
              return [
                    {src: "/Media/boston.jpg", thumbnail: "/Media/boston.jpg" },
                    {src: "/Media/bird.jpg", thumbnail: "/Media/bird.jpg" },
                    {src: "/Media/frog.jpg", thumbnail: "/Media/frog.jpg" }
                ];
            }
        };
    });



    /*****
      TEMPLATES (not implemented)
    ****/

    app.factory('templateFactory', function () {
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

    return app;
});


