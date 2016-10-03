(function(){
  'use strict';

  angular
  .module('profile', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('profile', {
      parent: 'layout',
      url: '/profile/:id',
      templateUrl: 'app/profile/profile.html',
      controller: 'ProfileCtrl',
    })
    .state('email_change', {
      parent: 'layoutAuth',
      url: '/email_change/:token/:tokenId/:userId',
      templateUrl: 'app/profile/emailchange.html',
      controller: 'EmailChangeCtrl'
    });

  }]);

}());
