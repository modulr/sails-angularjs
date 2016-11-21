(function(){
  'use strict';

  angular
  .module('auth')
  .controller('PasswordResetCtrl', ['$scope', '$state', '$location', 'sanitizeService', 'restFulService', function($scope, $state, $location, sanitizeService, restFulService){

    $scope.formPasswordReset = {};
    $scope.show = {
      form: false,
      message: false
    };

    // Si falta alguno de los 3 parametros
    if ($state.params.token === '' || $state.params.tokenId === '' || $state.params.userId === '')
      $location.path('error');

    // Se valida que el token exista en la DB
    restFulService.get('auth/findPasswordReset/' + $state.params.token +'/'+ $state.params.tokenId +'/'+ $state.params.userId)
    .then(function(response){

      $scope.show.form = true;

    })
    .catch(function(err){
      if (err.status != 302) {
        $location.path('error/' + err.status);
      } else {
        $location.path('/');
      }
    });

    $scope.passwordReset = function(event) {

      if ($('#formPasswordReset').smkValidate()) {
        if( $.smkEqualPass('#formPasswordReset #password', '#formPasswordReset #rePassword') ){

          var btn = $(event.target);
          btn.button('loading');

          var data = sanitizeService.array($scope.formPasswordReset);

          console.log(data);

          restFulService.put('auth/passwordReset/' + $state.params.userId, data)
          .then(function(response){

            $scope.show.form = false;
            $scope.show.message = true;

          })
          .finally(function(){
            btn.button('reset');
          });

        }
      }

    };

  }]);

}());
