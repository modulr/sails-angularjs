(function(){
  'use strict';

  angular
  .module('auth', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('layoutAuth.login', {
      url: '/',
      templateUrl: 'core/auth/views/login.html',
      controller: 'LoginCtrl'
    })
    .state('layoutAuth.signup', {
      url: '/signup',
      templateUrl: 'core/auth/views/signup.html',
      controller: 'SignupCtrl'
    })
    .state('layoutAuth.confirmEmail', {
      url: '/confirm_email/:token/:tokenId/:userId',
      templateUrl: 'core/auth/views/confirmEmail.html',
      controller: 'ConfirmEmailCtrl'
    })
    .state('layoutAuth.beginPasswordReset', {
      url: '/begin_password_reset',
      templateUrl: 'core/auth/views/beginPasswordReset.html',
      controller: 'BeginPasswordResetCtrl'
    })
    .state('layoutAuth.sendPasswordReset', {
      url: '/send_password_reset',
      templateUrl: 'core/auth/views/sendPasswordReset.html',
      controller: 'SendPasswordResetCtrl'
    })
    .state('layoutAuth.passwordReset', {
      url: '/password_reset/:token/:tokenId/:userId',
      templateUrl: 'core/auth/views/passwordReset.html',
      controller: 'PasswordResetCtrl'
    });

  }]);

}());
