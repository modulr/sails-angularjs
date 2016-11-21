(function(){
  'use strict';

  angular
  .module('settings', [])
  .config(['$stateProvider', function($stateProvider){

    $stateProvider
    .state('modules', {
      parent: 'layout',
      url: '/settings/modules',
      templateUrl: 'app/modules/settings/modules/modules.html',
      controller: 'ModulesCtrl'
    });

  }]);

}());
