(function(){
  'use strict';

  angular
  .module('auth')
  .controller('ConfirmEmailCtrl', ['$scope', '$state', '$location', 'restFulService', function($scope, $state, $location, restFulService){

    $scope.show = {
      message: false
    };

    // Si falta alguno de los 3 parametros
    if ($state.params.token === '' || $state.params.tokenId === '' || $state.params.userId === '')
      $location.path('error');

    // Se valida que el token exista en la DB
    restFulService.get('auth/confirmEmail/' + $state.params.token +'/'+ $state.params.tokenId +'/'+ $state.params.userId)
    .then(function(response){
      $scope.show.message = true;
    })
    .catch(function(err){
      if (err.status != 302) {
        $location.path('error/' + err.status);
      } else {
        $location.path('/');
      }
      //$state.go('error', { errorId: err.status });
    });

  }]);

}());
