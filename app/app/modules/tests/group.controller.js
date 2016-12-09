(function(){
  'use strict';

  angular
  .module('tests')
  .controller('GroupCtrl', ['$scope', 'restFulService', '$state', function($scope, restFulService, $state){

    $scope.group = null;

    // Methods
    function getTests(groupId) {
      restFulService.get('testgroup/findOneTestGroupWithTests/' + groupId)
      .then(function(response){
        $scope.group = response;
      });
    }

    // Events
    $scope.getTest = function(groupId, testId) {
      $state.go('test', { groupId: groupId, testId: testId });
    };

    // Watch
    getTests($state.params.groupId);

  }]);

}());
