angular.module('umbraco.directives', [])
.directive('val-regex', function () {

        /// <summary>
        ///     A custom directive to allow for matching a value against a regex string.
        ///     NOTE: there's already an ng-pattern but this requires that a regex expression is set, not a regex string
        ///</summary>

        return {
          require: 'ngModel',
          link: function (scope, elm, attrs, ctrl) {

            var regex = new RegExp(scope.$eval(attrs.valRegex));

            ctrl.$parsers.unshift(function (viewValue) {
              if (regex.test(viewValue)) {
                        // it is valid
                        ctrl.$setValidity('val-regex', true);
                        return viewValue;
                      }
                      else {
                        // it is invalid, return undefined (no model update)
                        ctrl.$setValidity('val-regex', false);
                        return undefined;
                      }
                    });
          }
        };
      })

.directive('appVersion', ['version', function (version) {
  return function (scope, elm, attrs) {
    elm.text(version);
  };
}])

.directive('preventDefault', function () {
  return function (scope, element, attrs) {
    $(element).click(function (event) {
      event.preventDefault();
    });
  };
})

.directive('autoScale', function ($window) {
  return function (scope, el, attrs) {

    var totalOffset = 0;
    var offsety = parseInt(attrs.autoScale, 10);
    var window = angular.element($window);
    if (offsety !== undefined){
      totalOffset += offsety;
    }

    setTimeout(function () {
      el.height(window.height() - (el.offset().top + totalOffset));
    }, 300);

    window.bind("resize", function () {
      el.height(window.height() - (el.offset().top + totalOffset));
    });

  };
})


.directive('headline', function ($window) {
  return function (scope, el, attrs) {

    var h1 = $("<h1 class='umb-headline-editor'></h1>").hide();
    el.parent().prepend(h1);
    el.addClass("umb-headline-editor");

    if (el.val() !== '') {
      el.hide();
      h1.text(el.val());
      h1.show();
    } else {
      el.focus();
    }

    el.on("blur", function () {
      el.hide();
      h1.html(el.val()).show();
    });

    h1.on("click", function () {
      h1.hide();
      el.show().focus();
    });
  };
})


.directive('onKeyup', function () {
  return function (scope, elm, attrs) {
    elm.bind("keyup", function () {

      scope.$apply(attrs.onKeyup);
    });
  };
})

.directive('propertyEditor', function () {
  return {
    restrict: 'A',
    template: '<div class="controls controls-row" ng-include="editorView"></div>',
            //templateUrl: '/partials/template.html',
            link: function (scope, iterStartElement, attr) {

              var property = scope.$eval(attr.propertyEditor);
              var path = property.controller;
              var editor = "views/propertyeditors/" + property.view.replace('.', '/') + "/editor.html";

              if (path !== undefined && path !== "") {
                path = "views/propertyeditors/" + path.replace('.', '/') + "/controller.js";
                require([path], function () {
                  scope.editorView = editor;
                });
              } else {
                scope.editorView = editor;
              }


            }
          };
        })


.directive('onKeyDown', function ($key) {
  return {
    link: function (scope, elm, attrs) {
      $key('keydown', scope, elm, attrs);
    }
  };
})


.directive('onBlur', function () {
  return function (scope, elm, attrs) {
    elm.bind("blur", function () {
      scope.$apply(attrs.onBlur);
    });
  };
})

.directive('onFocus', function () {
  return function (scope, elm, attrs) {
    elm.bind("focus", function () {
      scope.$apply(attrs.onFocus);
    });
  };
})


.directive('umbPanel', function(){
  return {
    restrict: 'E',
    replace: true,
    transclude: 'true',
    templateUrl: '/belle/views/directives/umb-panel.html'
  };
})

.directive('umbHeader', function($parse, $timeout){
  return {
    restrict: 'E',
    replace: true,
    transclude: 'true',
    templateUrl: '/belle/views/directives/umb-header.html',

    compile: function compile(tElement, tAttrs, transclude) {
      return function postLink(scope, iElement, iAttrs, controller) {

        scope.panes = [];
        var $panes = $('div.tab-content');

        var activeTab = 0, _id, _title, _active;
        $timeout(function() {

          $panes.find('.tab-pane').each(function(index) {
            var $this = angular.element(this);
            var _scope = $this.scope();

            _id = $this.attr("id");
            _title = $this.attr('title');
            _active = !_active && $this.hasClass('active');

            if(iAttrs.fade){$this.addClass('fade');}

            scope.panes.push({
              id: _id,
              title: _title,
              active: _active
            });

          });

          if(scope.panes.length && !_active) {
            $panes.find('.tab-pane:first-child').addClass('active' + (iAttrs.fade ? ' in' : ''));
            scope.panes[0].active = true;
          }

                  }); //end timeout
              }; //end postlink
            }
          };
        })

.directive('umbTabView', function(){
  return {
    restrict: 'E',
    replace: true,
    transclude: 'true',
    templateUrl: '/belle/views/directives/umb-tab-view.html'
  };
})

.directive('umbTab', function(){
  return {
    restrict: 'E',
    replace: true,
    transclude: 'true',

    scope: {
      title: '@',
      id: '@'
    },

    templateUrl: '/belle/views/directives/umb-tab.html'
  };
})



.directive('umbProperty', function(){
  return {
    restrict: 'E',
    replace: true,
    transclude: 'true',
    templateUrl: '/belle/views/directives/umb-property.html'
  };
})


.directive('umbTree', function ($compile, $log, treeService) {
  $log.log("Adding umb-tree directive");

  return {
    restrict: 'E',
    replace: true,
    terminal: false,

    scope: {
      section: '@',
      showoptions: '@',
      showheader: '@',
      cachekey: '@',
      preventdefault: '@'
    },

    compile: function (element, attrs) {
       //config
       var showheader = (attrs.showheader === 'false') ? false : true;
       var showoptions = (attrs.showoptions === 'false') ? false : true;
       var _preventDefault = (attrs.preventdefault === 'true') ? "prevent-default" : "";
       
       var template = '<ul class="umb-tree">' + 
       '<li class="root">';

       if(showheader){ 
         template +='<div>' + 
         '<h5><a class="root-link">{{tree.name}}</a><i class="umb-options"><i></i><i></i><i></i></i></h5>' + 
         '</div>';
       }
       template += '<ul>' +
                '<umb-tree-item ng-repeat="child in tree.children" node="child" preventdefault="{{preventdefault}}" showheader="{{showheader}}" showoptions="{{showoptions}}" section="{{section}}"></umb-tree-item>' +
                '</ul>' +
              '</li>' +
             '</ul>';

      var newElem = $(template);
      element.replaceWith(template);

      return function (scope, element, attrs, controller) {
          function loadTree(){
            if(scope.section){
                scope.tree = treeService.getTree({section:scope.section, cachekey: scope.cachekey});
            }
          } 

          if(scope.node === undefined){
              scope.$watch("section",function (newVal, oldVal) {
                if(!newVal){
                  scope.tree = undefined;
                  scope.node = undefined;
                }else if(newVal !== oldVal){
                  loadTree();
                }
            });
          }
          loadTree();
       };
     }
    };
  })

.directive('umbTreeItem', function($compile, $http, $templateCache, $interpolate, $log, treeService) {
  return {
    restrict: 'E',
    replace: true,

    scope: {
      section: '@',
      showoptions: '@',
      showheader: '@',
      cachekey: '@',
      preventdefault: '@',
      node:'='
    },

    template: '<li><div ng-style="setTreePadding(node)">' +
       '<ins ng-class="{\'icon-caret-right\': !node.expanded, \'icon-caret-down\': node.expanded}" ng-click="load(node)"></ins>' +
       '<i class="icon umb-tree-icon sprTree {{node.icon}}"></i>' +
       '<a ng-click="select(this, node, $event)" ng-href="#{{node.view}}">{{node.name}}</a>' +
       '<i class="umb-options" ng-click="options(this, node, $event)"><i></i><i></i><i></i></i>' +
       '</div>'+
       '</li>',

    link: function (scope, element, attrs) {
      $log.log("render item");
      
        scope.options = function(e, n, ev){ 
          scope.$emit("treeOptionsClick", {element: e, node: n, event: ev});
        };

        scope.select = function(e,n,ev){
          scope.$emit("treeNodeSelect", {element: e, node: n, event: ev});
        };

        scope.load = function (node) {
          if (node.expanded){
            node.expanded = false;
            node.children = [];
          }else {
            node.children =  treeService.getChildren({node: node, section: scope.section});
            node.expanded = true;
          }   
        };

        scope.setTreePadding = function(node) {
          return { 'padding-left': (node.level * 20) + "px" };
        };

        var template = '<ul ng-class="{collapsed: !node.expanded}"><umb-tree-item ng-repeat="child in node.children" node="child" preventdefault="{{preventdefault}}" showheader="{{showheader}}" showoptions="{{showoptions}}" section="{{section}}"></umb-tree-item></ul>';
        var newElement = angular.element(template);
        $compile(newElement)(scope);
        element.append(newElement);
    }
  };
})



.directive('include', function($compile, $http, $templateCache, $interpolate, $log) {

  $log.log("loading view");

  // Load a template, possibly from the $templateCache, and instantiate a DOM element from it
  function loadTemplate(template) {
    return $http.get(template, {cache:$templateCache}).then(function(response) {
      return angular.element(response.data);
    }, function(response) {
      throw new Error('Template not found: ' + template);
    });
  }

  return {
    restrict:'E',
    priority: 100,        // We need this directive to happen before ng-model
    terminal: false,       // We are going to deal with this element
    compile: function(element, attrs) {
      // Extract the label and validation message info from the directive's original element
      //var validationMessages = getValidationMessageMap(element);
      //var labelContent = getLabelContent(element);

      // Clear the directive's original element now that we have extracted what we need from it
      element.html('');

      return function postLink(scope, element, attrs) {

        var path = scope.$eval(attrs.template);

        // Load up the template for this kind of field, default to the simple input if none given
        loadTemplate(path || 'error.html').then(function(templateElement) {
          // Set up the scope - the template will have its own scope, which is a child of the directive's scope
          var childScope = scope.$new();
          
          // Place our template as a child of the original element.
          // This needs to be done before compilation to ensure that it picks up any containing form.
          element.append(templateElement);

          // We now compile and link our template here in the postLink function
          // This allows the ng-model directive on our template's <input> element to access the ngFormController
          $compile(templateElement)(childScope);

          // Now that our template has been compiled and linked we can access the <input> element's ngModelController
          //childScope.$field = inputElement.controller('ngModel');
        });
      };
    }
  };
});
