(function(){
  'use strict';

  angular
  .module('helpers')
  .directive('loading', loading);

  function loading() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        var loadingSpinner = '<div class="loading-panel">Loading...</div>';

        scope.$watch(attrs.loading, function (val) {
          if(val) {
            element.parent().css('position', 'relative');
            element.append(angular.element(loadingSpinner));
          } else {
            element.parent().css('position', 'initial');
            element.children('div.loading-panel').remove();
          }
        });

      }
    };
  }
})();
