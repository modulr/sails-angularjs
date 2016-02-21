(function(){
  'use strict';

  angular
  .module('log', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('layout.login', {
      url: '/log/login',
      templateUrl: 'app/log/views/logLogin.html',
      controller: 'LogLoginCtrl'
    })
    .state('layout.request', {
      url: '/log/request',
      templateUrl: 'app/log/views/logRequest.html',
      controller: 'LogRequestCtrl'
    });

  }]);

}());
