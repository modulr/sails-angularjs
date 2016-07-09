(function(){
  'use strict';

  angular
  .module('auth')
  .controller('LoginCtrl', ['$rootScope', '$scope', '$state', '$translate', 'sanitizeService', 'restFulService', function($rootScope, $scope, $state, $translate, sanitizeService, restFulService){

    $scope.formLogin = {
        emailOrUsername: 'demo',
        password: 'Demo123',
      rememberMe: false
    };

    $scope.login = function(event){

      $('#formLogin').removeClass('animated shake');

      if ($('#formLogin').smkValidate()) {

        var btn = $(event.target);
        btn.button('loading');

        var data = sanitizeService.array($scope.formLogin);

        restFulService.post('auth/login', data)
        .then(function(response) {

          $rootScope.user = response.user;

          localStorage.setItem('token', response.token);
          $translate.use(response.user.lang);

          $state.go('layout.dashboard');

          // // Se redirecciona a la ruta indicada
          // if ($rootScope.url.state !== null) {
          //   $state.go($rootScope.url.state, $rootScope.url.params);
          // } else{
            //
          //}
        })
        .catch(function(err){

          $('#formLogin').addClass('animated shake');

          if (err.status == 404) {
            $translate('LOGIN.MESSAGES.ERROR404').then(function (translate) {
              $.smkAlert({
                text: translate,
                type: 'warning'
              });
            });
          }else if (err.status == 400) {
            $translate('LOGIN.MESSAGES.ERROR400').then(function (translate) {
              $.smkAlert({
                text: translate,
                type: 'warning'
              });
            });
          }

        })
        .finally(function(){
          btn.button('reset');
        });

      }

    };


  }]);

}());
