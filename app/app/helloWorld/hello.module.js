(function(){
  'use strict';

  angular
  .module('helloWorld', [])
  .config(['$stateProvider', function($stateProvider){

    // Create routes
    $stateProvider
    .state('layout.hello', {
      url: '/hello',
      templateUrl: 'app/helloWorld/hello.html',
      controller: 'HelloCtrl'
    });

  }]);

}());
