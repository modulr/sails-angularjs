(function(){
  'use strict';

  angular
  .module('helpers')
  .directive('scrollToTop', [function(){

    function linker(scope, element, attrs){

      if (scope.$first){
        var parent = element.parent();
        parent.animate({scrollTop: 0}, 'slow');
      }

    }

    return {
      restrict: 'A',
      link: linker
    };

  }]);

})();
