(function(){
  'use strict';

  angular
  .module('access', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('layout.access', {
      url: '/access',
      templateUrl: 'app/access/views/access.html',
      controller: 'AccessCtrl'
    });

  }]);

}());
