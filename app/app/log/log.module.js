(function(){
  'use strict';

  angular
  .module('log', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('layout.login', {
      url: '/log/login',
      templateUrl: 'app/log/logLogin.html',
      controller: 'LogLoginCtrl'
    })
    .state('layout.request', {
      url: '/log/request',
      templateUrl: 'app/log/logRequest.html',
      controller: 'LogRequestCtrl'
    });

  }]);

}());
