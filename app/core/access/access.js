(function(){
  'use strict';

  angular
  .module('access', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('layout.access', {
      url: '/access',
      templateUrl: 'core/access/views/access.html',
      controller: 'AccessCtrl'
    });

  }]);

}());
