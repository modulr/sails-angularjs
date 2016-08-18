(function(){
  'use strict';

  angular
  .module('users', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('users', {
      parent: 'layout',
      url: '/users',
      templateUrl: 'app/users/users/users.html',
      controller: 'UsersCtrl'
    })
    .state('roles', {
      parent: 'layout',
      url: '/users/roles',
      templateUrl: 'app/users/roles/roles.html',
      controller: 'RolesCtrl'
    })
    .state('access', {
      parent: 'layout',
      url: '/users/access',
      templateUrl: 'app/users/access/access.html',
      controller: 'AccessCtrl'
    });

  }]);

}());
