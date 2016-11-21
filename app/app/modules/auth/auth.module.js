(function(){
  'use strict';

  angular
  .module('auth', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('login', {
      parent: 'layoutAuth',
      url: '/',
      templateUrl: 'app/modules/auth/login.html',
      controller: 'LoginCtrl'
    })
    .state('signup', {
      parent: 'layoutAuth',
      url: '/signup',
      templateUrl: 'app/modules/auth/signup.html',
      controller: 'SignupCtrl'
    })
    .state('confirmEmail', {
      parent: 'layoutAuth',
      url: '/confirm_email/:token/:tokenId/:userId',
      templateUrl: 'app/modules/auth/confirmEmail.html',
      controller: 'ConfirmEmailCtrl'
    })
    .state('beginPasswordReset', {
      parent: 'layoutAuth',
      url: '/begin_password_reset',
      templateUrl: 'app/modules/auth/beginPasswordReset.html',
      controller: 'BeginPasswordResetCtrl'
    })
    .state('sendPasswordReset', {
      parent: 'layoutAuth',
      url: '/send_password_reset',
      templateUrl: 'app/modules/auth/sendPasswordReset.html',
      controller: 'SendPasswordResetCtrl'
    })
    .state('passwordReset', {
      parent: 'layoutAuth',
      url: '/password_reset/:token/:tokenId/:userId',
      templateUrl: 'app/modules/auth/passwordReset.html',
      controller: 'PasswordResetCtrl'
    });

  }]);

}());
