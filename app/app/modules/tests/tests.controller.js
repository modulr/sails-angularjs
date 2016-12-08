(function(){
  'use strict';

  angular
  .module('tests')
  .controller('TestsCtrl', ['$scope', 'restFulService', function($scope, restFulService){

    $scope.testGroups = [];
    $scope.test = null;
    $scope.questions = [];
    $scope.count = 1;
    $scope.percentaje = 0;

    // Methods
    function getTestGroups() {
      restFulService.get('testgroup/findTestGroup')
      .then(function(response){
        $scope.testGroups = response;
      });
    }

    function getPercentage() {
      $scope.percentaje = ($scope.count)*100/($scope.questions.length);
    }

    // Events
    $scope.getQuestions = function(event, test) {
      console.log(test);
      $scope.test = test;
      restFulService.get('testquestion/findByTest/' + test.id)
      .then(function(response){
        $scope.questions = response;
        $scope.count = 1;
        getPercentage();
      });
    };

    $scope.next = function(index) {
      $scope.count = index;
      getPercentage();
      if ($scope.questions.length == $scope.count) {
        $scope.finish();
      }
    };

    $scope.finish = function() {
      console.log($scope.questions.length);
    };

    // Watch
    getTestGroups();

  }]);

}());
