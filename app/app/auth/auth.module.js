(function(){
    'use strict';

    angular
    .module('auth', [])
    .config(['$stateProvider', function($stateProvider){

        $stateProvider
        .state('layoutAuth.login', {
            url: '/',
            templateUrl: 'app/auth/login.html',
            controller: 'LoginCtrl'
        })
        .state('layoutAuth.signup', {
            url: '/signup',
            templateUrl: 'app/auth/signup.html',
            controller: 'SignupCtrl'
        })
        .state('layoutAuth.confirmEmail', {
            url: '/confirm_email/:token/:tokenId/:userId',
            templateUrl: 'app/auth/confirmEmail.html',
            controller: 'ConfirmEmailCtrl'
        })
        .state('layoutAuth.beginPasswordReset', {
            url: '/begin_password_reset',
            templateUrl: 'app/auth/beginPasswordReset.html',
            controller: 'BeginPasswordResetCtrl'
        })
        .state('layoutAuth.sendPasswordReset', {
            url: '/send_password_reset',
            templateUrl: 'app/auth/sendPasswordReset.html',
            controller: 'SendPasswordResetCtrl'
        })
        .state('layoutAuth.passwordReset', {
            url: '/password_reset/:token/:tokenId/:userId',
            templateUrl: 'app/auth/passwordReset.html',
            controller: 'PasswordResetCtrl'
        });

    }]);

}());
