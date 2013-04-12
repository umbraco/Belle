'use strict';

define(['angular'], function (angular) {

/* Directives */
return angular.module('umbraco.directives', [])
    .directive('appVersion', ['version', function (version) {
        return function(scope, elm, attrs) {
          elm.text(version);
        };
    }])
    .directive('preventDefault', function () {
        return function (scope, element, attrs) {
            $(element).click(function (event) {
                event.preventDefault();
            });
        }
    }).directive('autoScale', function ($window) {
        return function(scope, el, attrs) {

            var totalOffset = 0;
            var offsety = parseInt(attrs.autoScale);
            var window = angular.element($window);
            if (offsety != undefined)
                totalOffset += offsety;

            el.height(window.height() - (el.offset().top + totalOffset));
            window.bind("resize", function() {
                el.height(window.height() - (el.offset().top + totalOffset));
            });

        };
    }).directive('shadowScroll', function ($window) {
        return function(scope, el, attrs) {

            var window = angular.element($window);
            window.bind("scroll", function() {
                if(el.offset().top !== 0){
                        if(!el.hasClass('shadow')){
                            el.addClass('shadow');
                        }
                    }else{
                        el.removeClass('shadow');
                    }
            });

        };
    });

});
