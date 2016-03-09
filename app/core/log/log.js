(function(){
  'use strict';

  angular
  .module('log', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('layout.login', {
      url: '/log/login',
      templateUrl: 'core/log/views/logLogin.html',
      controller: 'LogLoginCtrl'
    })
    .state('layout.request', {
      url: '/log/request',
      templateUrl: 'core/log/views/logRequest.html',
      controller: 'LogRequestCtrl'
    });

  }]);

}());
