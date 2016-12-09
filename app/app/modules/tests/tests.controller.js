(function(){
  'use strict';

  angular
  .module('tests')
  .controller('TestsCtrl', ['$scope', 'restFulService', '$state', function($scope, restFulService, $state){

    $scope.groups = [];

    // Methods
    function getGroups() {
      restFulService.get('testgroup/findAllTestGroup')
      .then(function(response){
        $scope.groups = response;
      });
    }

    $scope.getTests = function(groupId) {
      $state.go('group', { groupId: groupId });
    };

    // Watch
    getGroups();

  }]);

}());
