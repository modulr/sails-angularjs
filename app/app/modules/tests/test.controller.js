(function(){
  'use strict';

  angular
  .module('tests')
  .controller('TestCtrl', ['$scope', 'restFulService', '$state', function($scope, restFulService, $state){

    $scope.test = null;

    $scope.count = 0;
    $scope.percentaje = 0;

    // Methods
    function getQuestions(testId) {
      restFulService.get('test/' + testId)
      .then(function(response){
        $scope.test = response;
        $scope.count = 0;
        getPercentage();
      });
    }

    function getPercentage() {
      $scope.percentaje = ($scope.count)*100/($scope.test.questions.length);
      console.log($scope.percentaje);
    }

    // Events
    $scope.skip = function(index) {
      if ($scope.test.questions.length > index) {
        $scope.count = index;
      } else {
        $scope.count = 0;
      }
    };

    $scope.next = function(index) {
      if ($scope.test.questions.length > index) {
        $scope.count = index;
      } else {
        $scope.count = 0;
      }
      getPercentage();
      $scope.finish();
    };

    $scope.rate = function(index) {
      $scope.finish();
    };

    $scope.finish = function() {
      console.log($scope.test.questions.length);
      console.log($scope.count);
      if ($scope.test.questions.length == $scope.count) {
        console.log($scope.test.questions.length);
      }
    };


    // Watch
    getQuestions($state.params.testId);

  }]);

}());
