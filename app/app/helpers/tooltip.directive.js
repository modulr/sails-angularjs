/**
* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
* UsersCtrl
* <a tooltip data-placement="bottom" data-title="title"></a>
* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
(function(){
  'use strict';

  angular
  .module('helpers')
  .directive('tooltip', tooltip);

  function tooltip() {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        $(elem).tooltip({
          container: 'body',
          title : attrs.title,
          placement : attrs.placement,
          html: true
        });
      }
    };
  }

})();
