(function(){
  'use strict';

  angular
  .module('error', [])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/error/');

    $stateProvider
    .state('layoutAuth.error', {
      url: '/error/:errorId',
      templateUrl: 'core/error/views/error.html',
      controller: 'ErrorCtrl',
      data: {
        access : 'always'
      }
    });

  }]);

}());
