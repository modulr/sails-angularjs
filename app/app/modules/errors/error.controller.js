(function(){
  'use strict';

  angular
  .module('errors')
  .controller('ErrorCtrl', ['$scope', '$state', 'errorService', function($scope, $state, errorService){

    if ($state.params.errorId === '') {
      $scope.errorId = 404;
    }else{
      $scope.errorId = $state.params.errorId;
    }

    $scope.error = errorService.getStatusCodeText($scope.errorId);

  }]);

}());
