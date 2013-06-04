angular.module('umbraco.services.navigation', [])
.factory('navigationService', function ($rootScope, $routeParams, $log, dialog) {

	var _currentSection = $routeParams.section;
	var _currentId = $routeParams.id;
	var _currentNode;
	var _ui = {};
	var _actions = [];
	var _menuTitle = "";

	function _setMode(mode){
		switch(mode)
		{
			case 'tree':
			_ui.showNavigation = true;
			_ui.showContextMenu = false;
			_ui.showContextMenuDialog = false;
			_ui.stickyNavigation = false;
			break;
			case 'menu':
			_ui.showNavigation = true;
			_ui.showContextMenu = true;
			_ui.showContextMenuDialog = false;
			_ui.stickyNavigation = true;
			break;
			case 'dialog':
			_ui.stickyNavigation = true;
			_ui.showNavigation = true;
			_ui.showContextMenu = false;
			_ui.showContextMenuDialog = true;
			break;
			case 'search':
			_ui.stickyNavigation = false;
			_ui.showNavigation = true;
			_ui.showContextMenu = false;
			_ui.showSearchResults = true;
			_ui.showContextMenuDialog = false;
			break;      
			default:
			_ui.showNavigation = false;
			_ui.showContextMenu = false;
			_ui.showContextMenuDialog = false;
			_ui.showSearchResults = false;
			_ui.stickyNavigation = false;
			break;
		}
	}

	return {
		
		actions: _actions,
		currentSection: _currentSection,
		currentNode: _currentNode,
		currentId: _currentId,

		stickyNavigation: false,
		mode: "default",
		menuTitle: _menuTitle,
		ui: _ui,

		sections: function(){
			$log.log("fetch sections");

			return [
				{ name: "Content", cssclass: "content", alias: "content" },
				{ name: "Media", cssclass: "media", alias: "media" },
				{ name: "Settings", cssclass: "settings",  alias: "settings" },
				{ name: "Developer", cssclass: "developer", alias: "developer" },
				{ name: "Users", cssclass: "user", alias: "users" }
				];		
		},

		changeSection: function(sectionAlias){
			if(this.ui.stickyNavigation){
				_setMode("default-opensection");
				this.ui.currentSection = selectedSection;
				this.showTree(selectedSection);
			}
		},

		showTree: function(sectionAlias){

			if(!this.ui.stickyNavigation && sectionAlias !== this.ui.currentTree){
				$log.log("show tree" + sectionAlias);
				$("#search-form input").focus();
				this.ui.currentTree = sectionAlias;
				_setMode("tree");
			}
		},

		hideTree: function(){
			if(!this.ui.stickyNavigation){
				$log.log("hide tree");
				this.ui.currentTree = "";
				_setMode("default-hidesectiontree");
			}
		},

		showMenu: function (node, event) {
			$log.log("testing the show meny");

			if(event !== undefined && node.defaultAction && !event.altKey){
				//hack for now, it needs the complete action object to, so either include in tree item json
				//or lookup in service...
				var act = {
					alias: node.defaultAction,
					name: node.defaultAction
				};

				this.showDialog(node, act);

			}else{
				this.actions = tree.getActions({node: node, section: $scope.section});
				this.currentNode = node;
				this.menuTitle = node.name;
				_selectedId = node.id;
				_setMode("menu");
			}
		},

		hideMenu: function () {
			_selectedId = $routeParams.id;
			this.contextMenu = [];
			_setMode("tree");
		},

		showDialog: function (item, action) {
			_setMode("dialog");

			var _scope = $rootScope.$new();
			_scope.currentNode = item;

			//this.currentNode = item;
			this.dialogTitle = action.name;

			var templateUrl = "views/" + _currentSection + "/" + action.alias + ".html";
			var d = dialog.append(
						{
							container: $("#dialog div.umb-panel-body"),
							scope: _scope,
							template: templateUrl
						});
		},

		hideDialog: function() {
			this.showMenu(this.currentNode, undefined);
		},

		hideNavigation: function(){
			this.ui.currentSection = "";
			_setMode("default");
		}
	};

});