(function(){
  'use strict';

  angular
  .module('auth')
  .controller('BeginPasswordResetCtrl', ['$rootScope', '$scope', '$state', '$translate', 'sanitizeService', 'restFulService', function($rootScope, $scope, $state, $translate, sanitizeService, restFulService){

    $scope.formBeginPasswordReset = {};
    $rootScope.account = undefined;

    $scope.findAccount = function(event){

      $('#formBeginPasswordReset').removeClass('animated shake');

      if ($('#formBeginPasswordReset').smkValidate()) {

        var btn = $(event.target);
        btn.button('loading');

        var data = sanitizeService.array($scope.formBeginPasswordReset);

        restFulService.get('auth/findAccount/' + data.emailOrUsername)
        .then(function(response){

          $rootScope.account = response;
          $rootScope.account.email = $.smkHideEmail(response.email);
          $state.go('layoutAuth.sendPasswordReset');

        })
        .catch(function(err){
          $('#formBeginPasswordReset').addClass('animated shake');

          $translate('BEGIN-PASSWORD-RESET.MESSAGES.ERROR').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'warning'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
        });

      }
    };

  }]);

}());
