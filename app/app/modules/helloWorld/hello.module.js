(function(){
  'use strict';

  angular
  .module('helloWorld', [])
  .config(['$stateProvider', function($stateProvider){

    // Create routes
    $stateProvider
    .state('hello', {
      parent: 'layout',
      url: '/hello',
      templateUrl: 'app/modules/helloWorld/hello.html',
      controller: 'HelloCtrl'
    });

  }]);

}());
