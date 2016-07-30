(function(){
  'use strict';

  angular
  .module('files', [])
  .config(['$stateProvider', function($stateProvider){

    // Create routes
    $stateProvider
    .state('layout.files', {
      url: '/files',
      templateUrl: 'app/files/files.html',
      controller: 'FilesCtrl'
    });

  }]);

}());
