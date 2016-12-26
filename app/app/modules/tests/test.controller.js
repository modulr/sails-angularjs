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
    }

    function validateAnswers(correctAnswers, possibleAnswers) {
      var answeredAnswers = 0;
      var result = false;

      possibleAnswers.forEach(function(v, k){
        if (v.answer) {
          answeredAnswers++;

          if (v.title == correctAnswers.title) {
            result = true;
          }
        }
      });

      // Si el total de respuestas correctas es igual al total de respuestas contestadas por el usuario
      if ((correctAnswers.length == answeredAnswers) && result) {
        return true;
      } else {
        return false;
      }
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

      console.log(validateAnswers($scope.test.questions[index].correctAnswers, $scope.test.questions[index].possibleAnswers));

      validateAnswers($scope.test.questions[index].correctAnswers, $scope.test.questions[index].possibleAnswers);

      console.log('bien');

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
