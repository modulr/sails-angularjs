(function(){
  'use strict';

  angular
  .module('tests', [])
  .config(['$stateProvider', function($stateProvider){

    // Create routes
    $stateProvider
    .state('tests', {
      parent: 'layout',
      url: '/tests',
      templateUrl: 'app/modules/tests/tests.html',
      controller: 'TestsCtrl'
    });

  }]);

}());
