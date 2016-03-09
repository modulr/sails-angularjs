(function(){
  'use strict';

  angular
  .module('modules')
  .controller('ModulesCtrl', ['$rootScope', '$scope', 'restFulService', '$translate', function($rootScope, $scope, restFulService, $translate){

    $scope.modules = [];

    getModules();

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Events
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.treeOptions = {
      beforeDrop: function(e) {
        restFulService.put('module/saveOrder', $scope.modules)
        .then(function(response){
          $scope.modules = response;
          $rootScope.navigation = response;
          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });
        });
        return true;
      },
    };

    $scope.showModule = function(item)
    {
      restFulService.put('module/update/'+ item.id, {'active':item.active} )
      .then(function(response){
        $rootScope.navigation = response;
        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success',
            position: 'bottom-left'
          });
        });
      });
    };

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Methods
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    function getModules()
    {
      restFulService.get('module/navSettings')
      .then(function(response){
        $scope.modules = response;
      });
    }


  }]);

})();
