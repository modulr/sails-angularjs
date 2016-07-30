(function(){
    'use strict';

    angular
    .module('settings', [])
    .config(['$stateProvider', function($stateProvider){

        $stateProvider
        .state('layout.modules', {
            url: '/settings/modules',
            templateUrl: 'app/settings/modules.html',
            controller: 'ModulesCtrl'
        })
        .state('layout.roles', {
            url: '/settings/roles',
            templateUrl: 'app/settings/roles.html',
            controller: 'RolesCtrl'
        });

    }]);

}());
