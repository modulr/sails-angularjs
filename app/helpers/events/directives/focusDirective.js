(function(){
  'use strict';

  angular
  .module('modulr.helpers')
  .directive('focus', focus);

  function focus($timeout) {

    return function (scope, elem, attrs) {
      scope.$watch(attrs.focus, function (newVal) {
        if (newVal) {
          $timeout(function () {
            elem[0].focus();
          }, 0, false);
        }
      });
    };
  }

})();
