'use strict';


//require.js dependency handling
define(['app'], function (app) {


    /*****
          CONTENT, (injects the notification factory)
      ****/
    app.factory('contentFactory', function (notificationFactory) {
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
                                { alias: "map", label: "Map", view: "umbraco.googlemaps", value: "37.4419,-122.1419", config: { mapType: "ROADMAP", zoom: 4 } },
                                { alias: "upload", label: "Upload file", view: "umbraco.fileupload", value: "" }
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
                notificationFactory.success(content.name + " saved", "");

                //alert("Saved: " + JSON.stringify(content));
            },

            publishContent: function (content) {
                contentArray[content.id] = content;
                notificationFactory.success(content.name + " published", "");
            }

        };
    });




    /*****
        TREE
    ****/

    app.factory('treeFactory', function () {
        //implement this in local storage
        var treeArray = new Array();
        var currentSection = "content";

        return {

            getCurrentSection: function () {
                return currentSection;
            },

            getTree: function (section) {

                currentSection = section;

                if (treeArray[section] != undefined)
                    return treeArray[section];

                var t = {
                    name: section,
                    alias: section,
                    children: [
                        { name: "random-name-" + section, id: 1234, icon: "icon-home", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
                        { name: "random-name-" + section, id: 1235, icon: "icon-folder-close", view: section + "/edit/" + 1235, children: [], expanded: false, level: 1 },
                        { name: "random-name-" + section, id: 1236, icon: "icon-folder-close", view: section + "/edit/" + 1236, children: [], expanded: false, level: 1 },
                        { name: "random-name-" + section, id: 1237, icon: "icon-folder-close", view: section + "/edit/" + 1237, children: [], expanded: false, level: 1 }
                    ]
                };


                treeArray[section] = t;
                return treeArray[section];
            },

            getChildren: function (treeItem, section) {
                var iLevel = treeItem.level + 1;
                return [
                    { name: "child-of-" + treeItem.name, id: iLevel + "" + 1234, icon: "icon-file-alt", view: section + "/edit/" + iLevel + "" + 1234, children: [], expanded: false, level: iLevel },
                    { name: "random-name-" + section, id: iLevel + "" + 1235, icon: "icon-file-alt", view: section + "/edit/" + iLevel + "" + 1235, children: [], expanded: false, level: iLevel },
                    { name: "random-name-" + section, id: iLevel + "" + 1236, icon: "icon-file-alt", view: section + "/edit/" + iLevel + "" + 1236, children: [], expanded: false, level: iLevel },
                    { name: "random-name-" + section, id: iLevel + "" + 1237, icon: "icon-file-alt", view: section + "/edit/" + iLevel + "" + 1237, children: [], expanded: false, level: iLevel }
                ];
            },
        };
    });



    /*****
        NOTIFICATIONS
    ****/

    app.factory('notificationFactory', function ($rootScope) {

        var nArray = new Array();

        function add(item) {
            var index = nArray.length;
            nArray.push(item);

            setTimeout(function () {
                $rootScope.$apply(function() {
                    nArray.splice(index, 1);
                });
                
            }, 5000);
        }

        return {
            success: function (headline, message) {
                add({ headline: headline, message: message, type: 'success', time: new Date() });
            },
            error: function (headline, message) {
                add({ headline: headline, message: message, type: 'error', time: new Date() });
            },
            warning: function (headline, message) {
                add({ headline: headline, message: message, type: 'warning', time: new Date() });
            },
            remove: function (index) {
                nArray.splice(index, 1);
            },
            notifications: nArray,
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


