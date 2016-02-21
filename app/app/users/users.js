(function(){
  'use strict';

  angular
  .module('users', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('layout.users', {
      url: '/users',
      templateUrl: 'app/users/views/users.html',
      controller: 'UsersCtrl'
    })
    .state('layout.profile', {
      url: '/profile/:id',
      templateUrl: 'app/users/views/profile.html',
      controller: 'ProfileCtrl'
    });

  }]);

}());
