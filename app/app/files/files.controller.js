(function(){
  'use strict';

  angular
  .module('files')
  .controller('FilesCtrl', ['$rootScope', '$scope', 'restFulService', 'config', function($rootScope, $scope, restFulService, config){

    $scope.urlAPI = config.urlAPI;
    $scope.token = localStorage.getItem('token');

  }]);

}());
