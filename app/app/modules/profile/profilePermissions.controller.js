(function(){
  'use strict';

  angular
  .module('users')
  .controller('ProfilePermissionsCtrl', ['$scope', '$translate', 'restFulService', ProfilePermissionsCtrl]);

  function ProfilePermissionsCtrl($scope, $translate, restFulService) {


    $scope.formPermissions = {};


    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Events
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.savePermissions = function(event) {

      var btn = $(event.target);
      btn.button('loading');

      var data = {
        role: $scope.formPermissions.role
      };

      restFulService.put('user/' + $scope.user.id, data)
      .then(function(response){

        $scope.user.role = response.role;

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

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * watch & calls
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.$watch('user.role', function(nv, ov) {
      if(nv !== undefined && nv !== ''){
        $scope.formPermissions.permissions = nv.permissions;
      }
    });
    
    $scope.$watch('formPermissions.role', function(nv, ov) {
      if(nv !== undefined && nv !== ''){
        $scope.formPermissions.permissions = nv.permissions;
      }
    });


  }

}());
