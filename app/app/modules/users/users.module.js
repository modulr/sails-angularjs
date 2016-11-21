(function(){
  'use strict';

  angular
  .module('users', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('users', {
      parent: 'layout',
      url: '/users',
      templateUrl: 'app/modules/users/users/users.html',
      controller: 'UsersCtrl'
    })
    .state('roles', {
      parent: 'layout',
      url: '/users/roles',
      templateUrl: 'app/modules/users/roles/roles.html',
      controller: 'RolesCtrl'
    })
    .state('access', {
      parent: 'layout',
      url: '/users/access',
      templateUrl: 'app/modules/users/access/access.html',
      controller: 'AccessCtrl'
    });

  }]);

}());
