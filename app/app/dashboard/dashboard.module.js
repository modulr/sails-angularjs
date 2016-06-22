(function(){
  'use strict';

  angular
  .module('dashboard', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('layout.dashboard', {
      url: '/dashboard',
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashboardCtrl'
    });

  }]);

}());
