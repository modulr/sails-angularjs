(function(){
  'use strict';

  angular
  .module('helpers')
  .directive('escape', escape);

  function escape($timeout) {

    var KEY = 27;

    return function (scope, elem, attrs) {
      elem.bind('keydown', function (event) {
        if (event.keyCode === KEY) {
          scope.$apply(attrs.escape);
        }
      });

      scope.$on('$destroy', function () {
        elem.unbind('keydown');
      });
    };
  }

})();
