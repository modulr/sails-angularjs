(function(){
  'use strict';

  angular
  .module('users', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('layout.users', {
      url: '/users',
      templateUrl: 'core/users/views/users.html',
      controller: 'UsersCtrl'
    })
    .state('layout.profile', {
      url: '/profile/:id',
      templateUrl: 'core/users/views/profile.html',
      controller: 'ProfileCtrl'
    });

  }]);

}());
