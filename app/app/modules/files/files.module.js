(function(){
  'use strict';

  angular
  .module('files', [])
  .config(['$stateProvider', function($stateProvider){

    // Create routes
    $stateProvider
    .state('files', {
      parent: 'layout',
      url: '/files',
      templateUrl: 'app/modules/files/files.html',
      controller: 'FilesCtrl'
    });

  }]);

}());
