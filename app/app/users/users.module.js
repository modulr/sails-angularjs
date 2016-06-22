(function(){
    'use strict';

    angular
    .module('users', [])
    .config(['$stateProvider', function($stateProvider){

        $stateProvider
        .state('layout.users', {
            url: '/users',
            templateUrl: 'app/users/users.html',
            controller: 'UsersCtrl'
        })
        .state('layout.profile', {
            url: '/profile/:id',
            templateUrl: 'app/users/profile.html',
            controller: 'ProfileCtrl'
        })
        .state('layoutAuth.email_change', {
            url: '/email_change/:token/:tokenId/:userId',
            templateUrl: 'app/users/emailchange.html',
            controller: 'EmailChangeCtrl',
            data: {
                access : 'always'
            }
        })

        .state('layout.roles', {
            url: '/users/roles',
            templateUrl: 'app/users/roles.html',
            controller: 'RolesCtrl'
        })

        .state('layout.access', {
            url: '/users/access',
            templateUrl: 'app/users/access.html',
            controller: 'AccessCtrl'
        });

    }]);

}());
