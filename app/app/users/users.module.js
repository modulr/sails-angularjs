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
        .state('layout.roles', {
            url: '/users/roles',
            templateUrl: 'app/users/roles/roles.html',
            controller: 'RolesCtrl'
        })

        .state('layout.access', {
            url: '/users/access',
            templateUrl: 'app/users/access.html',
            controller: 'AccessCtrl'
        });

    }]);

}());
