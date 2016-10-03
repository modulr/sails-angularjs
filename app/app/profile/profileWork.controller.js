(function(){
  'use strict';

  angular
  .module('users')
  .controller('ProfileWorkCtrl', ['$scope', '$translate', 'restFulService', ProfileWorkCtrl]);

  function ProfileWorkCtrl($scope, $translate, restFulService) {

    $scope.formWork = {};


    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Events
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.saveWork = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      var data = {
        job: $scope.formWork.job.job,
        department: $scope.formWork.department.department,
        company: $scope.formWork.company.company
      };

      restFulService.put('profile/' + $scope.user.profile.id, data)
      .then(function(response){

        $scope.user.profile.job = response.job;
        $scope.user.profile.department = response.department;
        $scope.user.profile.company = response.company;

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success',
            position: 'bottom-left'
          });
        });
      })
      .finally(function(){
        btn.button('reset');
      });
    };

  }

}());
