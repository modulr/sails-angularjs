(function(){
  'use strict';

  angular
  .module('helloWorld')
  .controller('HelloCtrl', ['$scope', 'restFulService', function($scope, restFulService){

    $scope.greeting = [];

    // Events

    // Methods
    function getGreeting()
    {
      restFulService.get('hello')
      .then(function(response){
        $scope.greeting = response[0];
      });
    }

    // Watch
    getGreeting();

  }]);

}());
