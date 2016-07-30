(function(){
    'use strict';

    angular
    .module('profile', [])
    .config(['$stateProvider', function($stateProvider){

        $stateProvider
        .state('layout.profile', {
            url: '/profile/:id',
            templateUrl: 'app/profile/profile.html',
            controller: 'ProfileCtrl',
        })

        .state('layoutAuth.email_change', {
            url: '/email_change/:token/:tokenId/:userId',
            templateUrl: 'app/profile/emailchange.html',
            controller: 'EmailChangeCtrl'
        });

    }]);

}());
