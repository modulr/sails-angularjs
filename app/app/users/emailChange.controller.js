(function(){
  'use strict';

  angular
  .module('users')
  .controller('EmailChangeCtrl', ['$rootScope', '$scope', '$state', '$location', '$translate', 'restFulService', 'config', 'errorService', function($rootScope, $scope, $state, $location, $translate, restFulService, config, errorService){

    $scope.show = {
      message: false
    };

    // Si falta alguno de los 3 parametros
    if ($state.params.token === '' || $state.params.tokenId === '' || $state.params.userId === '')
      $location.path('error');

    // Se valida que el token exista en la DB
    restFulService.get('emailChange/validate/' + $state.params.token +'/'+ $state.params.tokenId +'/'+ $state.params.userId)
    .then(function(response){
      $scope.email = response.email;
      $scope.show.message = true;
    })
    .catch(function(err){
      $location.path('error/' + err.status);
    });

  }]);

}());
