(function(){
  'use strict';

  angular
  .module('log', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('logLogin', {
      parent: 'layout',
      url: '/log/login',
      templateUrl: 'app/log/logLogin.html',
      controller: 'LogLoginCtrl'
    })
    .state('logRequest', {
      parent: 'layout',
      url: '/log/request',
      templateUrl: 'app/log/logRequest.html',
      controller: 'LogRequestCtrl'
    });

  }]);

}());
