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
    })
    .state('group', {
      parent: 'layout',
      url: '/tests/:groupId',
      templateUrl: 'app/modules/tests/group.html',
      controller: 'GroupCtrl'
    })
    .state('test', {
      parent: 'layout',
      url: '/tests/:groupId/:testId',
      templateUrl: 'app/modules/tests/test.html',
      controller: 'TestCtrl'
    });

  }]);

}());
