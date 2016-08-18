(function(){
  'use strict';

  angular
  .module('settings', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('modules', {
      parent: 'layout',
      url: '/settings/modules',
      templateUrl: 'app/settings/modules.html',
      controller: 'ModulesCtrl'
    });

  }]);

}());
