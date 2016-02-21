(function(){
  'use strict';

  angular
  .module('dashboard', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('layout.dashboard', {
      url: '/dashboard',
      templateUrl: 'modules/dashboard/views/dashboard.html',
      controller: 'DashboardCtrl'
    });

  }]);

}());
