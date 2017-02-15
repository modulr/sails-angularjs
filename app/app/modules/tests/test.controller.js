(function(){
  'use strict';

  angular
  .module('tests')
  .controller('TestCtrl', ['$scope', 'restFulService', '$state', function($scope, restFulService, $state){

    $scope.test = {
      currentCuestion: 0
    };

    // Methods
    function getQuestions(testId) {
      restFulService.get('test/' + testId)
      .then(function(response){
        $scope.test = response;
        $scope.test.currentCuestion = 0;
        $scope.test.questionsAnswered = [];
        $scope.test.percentajeAnswered = 0;
        $scope.test.score = 0;
        $scope.test.percentajeScore = null;
      });
    }

    function setPercentage(index) {
      var count = 0;

      $scope.test.questions[index].answers.forEach(function(v){
        if (v.selected) {
          count++;
        }
      });

      var i = $scope.test.questionsAnswered.indexOf(index);

      if (count>0) {
        if (i == -1) {
          $scope.test.questionsAnswered.push(index);
        }
      } else {
        if (i > -1) {
          $scope.test.questionsAnswered.splice(i, 1);
        }
      }

      $scope.test.percentajeAnswered = ($scope.test.questionsAnswered.length)*100/($scope.test.questions.length);
    }

    // Events
    $scope.prev = function(index) {
      setPercentage(index);
      if (index> 0) {
        $scope.test.currentCuestion = index-1;
      } else {
        $scope.test.currentCuestion = $scope.test.questions.length - 1;
      }
    };

    $scope.next = function(index) {
      setPercentage(index);
      if ($scope.test.questions.length > index + 1) {
        $scope.test.currentCuestion = index+1;
      } else {
        $scope.test.currentCuestion = 0;
      }
    };

    $scope.rate = function(index) {
      setPercentage(index);

      $scope.test.score = 0;

      $scope.test.questions.forEach(function(v) {
        var result = true;
        v.answers.forEach(function(v, k) {
          if (v.correct && !v.selected) {
            result = false;
          } else if (!v.correct && v.selected) {
            result = false;
          }
        });
        if (result) {
          $scope.test.score++;
        }
      });

      $scope.test.percentajeScore = ($scope.test.score)*100/($scope.test.questions.length);
      console.log($scope.test);
    };

    $scope.repeat = function() {
      getQuestions($state.params.testId);
    };


    // Watch
    getQuestions($state.params.testId);

  }]);

}());
