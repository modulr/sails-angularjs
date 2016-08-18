(function(){
  'use strict';

  angular
  .module('dashboard', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('dashboard', {
      parent: 'layout',
      url: '/dashboard',
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashboardCtrl'
    });

  }]);

}());
