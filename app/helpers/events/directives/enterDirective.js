(function(){
  'use strict';

  angular
  .module('modulr.helpers')
  .directive('enter', enter);

  function enter($timeout) {

    var KEY = 13;

    return function (scope, elem, attrs) {
      elem.bind('keydown', function (event) {
        if (event.keyCode === KEY) {
          scope.$apply(attrs.enter);
        }
      });

      scope.$on('$destroy', function () {
        elem.unbind('keydown');
      });
    };
  }

})();
