(function(){
  'use strict';

  angular
  .module('auth')
  .controller('SendPasswordResetCtrl', ['$rootScope', '$scope', '$state', 'restFulService', function($rootScope, $scope, $state, restFulService){

    $scope.formSendPasswordReset = {};
    $scope.show = {
      message: false
    };

    if ($rootScope.account === undefined)
      $state.go('layoutAuth.beginPasswordReset');

    $scope.sendPasswordReset = function(event){

        var btn = $(event.target);
        btn.button('loading');

        var userId = $rootScope.account.id;

        restFulService.get('auth/createPasswordReset/' + userId)
        .then(function(response){

          $scope.show.message = true;

        })
        .finally(function(){
          btn.button('reset');
        });

    };

  }]);

}());
