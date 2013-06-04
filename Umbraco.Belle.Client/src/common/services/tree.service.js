angular.module('umbraco.services.tree', [])
.factory('treeService', function () {
		//implement this in local storage
		var treeArray = [];
		var currentSection = "content";

		return {
			getTree: function (options) {

				if(options === undefined){
					options = {};
				}

				var section = options.section || 'content';
				var cacheKey = options.cachekey || '';
				cacheKey += "_" + section;	

				if (treeArray[cacheKey] !== undefined){
					return treeArray[cacheKey];
				}
				
				var t;
				switch(section){

					case "content":
					t = {
						name: section,
						alias: section,

						children: [
							{ name: "My website", id: 1234, icon: "icon-home", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1, defaultAction: "create" },
							{ name: "Components", id: 1235, icon: "icon-cogs", view: section + "/edit/" + 1235, children: [], expanded: false, level: 1, defaultAction: "create"  },
							{ name: "Archieve", id: 1236, icon: "icon-folder-close", view: section + "/edit/" + 1236, children: [], expanded: false, level: 1, defaultAction: "create"  },
							{ name: "Recycle Bin", id: 1237, icon: "icon-trash", view: section + "/trash/view/", children: [], expanded: false, level: 1, defaultAction: "create"  }
						]
					};
					break;

					case "developer":
					t = {
						name: section,
						alias: section,

						children: [
						{ name: "Data types", id: 1234, icon: "icon-folder-close", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
						{ name: "Macros", id: 1235, icon: "icon-folder-close", view: section + "/edit/" + 1235, children: [], expanded: false, level: 1 },
						{ name: "Pacakges", id: 1236, icon: "icon-folder-close", view: section + "/edit/" + 1236, children: [], expanded: false, level: 1 },
						{ name: "XSLT Files", id: 1237, icon: "icon-folder-close", view: section + "/edit/" + 1237, children: [], expanded: false, level: 1 },
						{ name: "Razor Files", id: 1237, icon: "icon-folder-close", view: section + "/edit/" + 1237, children: [], expanded: false, level: 1 }
						]
					};
					break;
					case "settings":
					t = {
						name: section,
						alias: section,

						children: [
						{ name: "Stylesheets", id: 1234, icon: "icon-folder-close", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
						{ name: "Templates", id: 1235, icon: "icon-folder-close", view: section + "/edit/" + 1235, children: [], expanded: false, level: 1 },
						{ name: "Dictionary", id: 1236, icon: "icon-folder-close", view: section + "/edit/" + 1236, children: [], expanded: false, level: 1 },
						{ name: "Media types", id: 1237, icon: "icon-folder-close", view: section + "/edit/" + 1237, children: [], expanded: false, level: 1 },
						{ name: "Document types", id: 1237, icon: "icon-folder-close", view: section + "/edit/" + 1237, children: [], expanded: false, level: 1 }
						]
					};
					break;
					default: 
					t = {
						name: section,
						alias: section,

						children: [
						{ name: "random-name-" + section, id: 1234, icon: "icon-home", defaultAction: "create", view: section + "/edit/" + 1234, children: [], expanded: false, level: 1 },
						{ name: "random-name-" + section, id: 1235, icon: "icon-folder-close", defaultAction: "create", view: section + "/edit/" + 1235, children: [], expanded: false, level: 1 },
						{ name: "random-name-" + section, id: 1236, icon: "icon-folder-close", defaultAction: "create", view: section + "/edit/" + 1236, children: [], expanded: false, level: 1 },
						{ name: "random-name-" + section, id: 1237, icon: "icon-folder-close", defaultAction: "create", view: section + "/edit/" + 1237, children: [], expanded: false, level: 1 }
						]
					};
					break;
				}				

				treeArray[cacheKey] = t;
				return treeArray[cacheKey];
			},

			getActions: function(treeItem, section){
				return [
				{ name: "Create", cssclass: "plus", alias: "create" },

				{ seperator: true, name: "Delete", cssclass: "remove", alias: "delete" },
				{ name: "Move", cssclass: "move",  alias: "move" },
				{ name: "Copy", cssclass: "copy", alias: "copy" },
				{ name: "Sort", cssclass: "sort", alias: "sort" },
				
				{ seperator: true, name: "Publish", cssclass: "globe", alias: "publish" },
				{ name: "Rollback", cssclass: "undo", alias: "rollback" },
				
				{ seperator: true, name: "Permissions", cssclass: "lock", alias: "permissions" },
				{ name: "Audit Trail", cssclass: "time", alias: "audittrail" },
				{ name: "Notifications", cssclass: "envelope", alias: "notifications" },

				{ seperator: true, name: "Hostnames", cssclass: "home", alias: "hostnames" },
				{ name: "Public Access", cssclass: "group", alias: "publicaccess" },
				
				{ seperator: true, name: "Reload", cssclass: "refresh", alias: "users" }
				];
			},	

			getChildActions: function(options){

				if(options === undefined){
					options = {};
				}
				var section = options.section || 'content';
				var treeItem = options.node;

				return [
				{ name: "Create", cssclass: "plus", alias: "create" },

				{ seperator: true, name: "Delete", cssclass: "remove", alias: "delete" },
				{ name: "Move", cssclass: "move",  alias: "move" },
				{ name: "Copy", cssclass: "copy", alias: "copy" },
				{ name: "Sort", cssclass: "sort", alias: "sort" },
				
				{ seperator: true, name: "Publish", cssclass: "globe", alias: "publish" },
				{ name: "Rollback", cssclass: "undo", alias: "rollback" },
				
				{ seperator: true, name: "Permissions", cssclass: "lock", alias: "permissions" },
				{ name: "Audit Trail", cssclass: "time", alias: "audittrail" },
				{ name: "Notifications", cssclass: "envelope", alias: "notifications" },

				{ seperator: true, name: "Hostnames", cssclass: "home", alias: "hostnames" },
				{ name: "Public Access", cssclass: "group", alias: "publicaccess" },
				
				{ seperator: true, name: "Reload", cssclass: "refresh", alias: "users" }
				];
			},

			getChildren: function (options) {

				if(options === undefined){
					options = {};
				}
				var section = options.section || 'content';
				var treeItem = options.node;

				var iLevel = treeItem.level + 1;

				//hack to have create as default content action
				var action;
				if(section === "content"){
					action = "create";
				}

				return [
					{ name: "child-of-" + treeItem.name, id: iLevel + "" + 1234, icon: "icon-file-alt", view: section + "/edit/" + iLevel + "" + 1234, children: [], expanded: false, level: iLevel, defaultAction: action },
					{ name: "random-name-" + section, id: iLevel + "" + 1235, icon: "icon-file-alt", view: section + "/edit/" + iLevel + "" + 1235, children: [], expanded: false, level: iLevel, defaultAction: action  },
					{ name: "random-name-" + section, id: iLevel + "" + 1236, icon: "icon-file-alt", view: section + "/edit/" + iLevel + "" + 1236, children: [], expanded: false, level: iLevel, defaultAction: action  },
					{ name: "random-name-" + section, id: iLevel + "" + 1237, icon: "icon-file-alt", view: "common/legacy/1237?p=" + encodeURI("developer/contentType.aspx?idequal1234"), children: [], expanded: false, level: iLevel, defaultAction: action  }
				];
			}
		};
	});