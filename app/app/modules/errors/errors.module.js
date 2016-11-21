(function(){
  'use strict';

  angular
  .module('errors', [])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/error/');

    $stateProvider
    .state('error', {
      parent: 'layoutAuth',
      url: '/error/:errorId',
      templateUrl: 'app/modules/errors/error.html',
      controller: 'ErrorCtrl'
    });

  }]);

}());
