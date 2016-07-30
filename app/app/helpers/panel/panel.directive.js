(function(){
  'use strict';

  angular
  .module('helpers')
  .directive('panel', panel);

  function panel() {
    return function($scope, elem, attrs) {
      $(elem).smkPanel();
    };
  }

})();
