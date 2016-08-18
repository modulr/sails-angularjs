(function(){
  'use strict';

  angular
  .module('auth', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('login', {
      parent: 'layoutAuth',
      url: '/',
      templateUrl: 'app/auth/login.html',
      controller: 'LoginCtrl'
    })
    .state('signup', {
      parent: 'layoutAuth',
      url: '/signup',
      templateUrl: 'app/auth/signup.html',
      controller: 'SignupCtrl'
    })
    .state('confirmEmail', {
      parent: 'layoutAuth',
      url: '/confirm_email/:token/:tokenId/:userId',
      templateUrl: 'app/auth/confirmEmail.html',
      controller: 'ConfirmEmailCtrl'
    })
    .state('beginPasswordReset', {
      parent: 'layoutAuth',
      url: '/begin_password_reset',
      templateUrl: 'app/auth/beginPasswordReset.html',
      controller: 'BeginPasswordResetCtrl'
    })
    .state('sendPasswordReset', {
      parent: 'layoutAuth',
      url: '/send_password_reset',
      templateUrl: 'app/auth/sendPasswordReset.html',
      controller: 'SendPasswordResetCtrl'
    })
    .state('passwordReset', {
      parent: 'layoutAuth',
      url: '/password_reset/:token/:tokenId/:userId',
      templateUrl: 'app/auth/passwordReset.html',
      controller: 'PasswordResetCtrl'
    });

  }]);

}());
