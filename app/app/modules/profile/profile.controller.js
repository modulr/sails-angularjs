(function(){
  'use strict';

  angular
  .module('users')
  .controller('ProfileCtrl', ['$rootScope', '$scope', '$state', '$location', '$translate', 'restFulService', 'config', 'errorService', ProfileCtrl]);

  function ProfileCtrl($rootScope, $scope, $state, $location, $translate, restFulService, config, errorService) {

    $scope.urlAPI = config.urlAPI;
    $scope.token =  localStorage.getItem('token');

    $scope.user = {};

    $scope.editMode = {
      profile: false
    };

    $scope.show = {
      btnPlace: false,
      btnFamily: false,
      btnEducation: false,
      btnContact: false
    };


    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Methods
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    function getUser(id){
      // Se obtiene el modelo user y el modelo profile
      restFulService.get('user/' + id)
      .then(function(response){
        $scope.user = response;
      })
      .catch(function(error){
        $location.path('/');
      });
    }

    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Events
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.saveFullName = function() {
      var data = {
        firstName: $scope.user.firstName,
        lastName: $scope.user.lastName
      };

      restFulService.put('user/' + $scope.user.id, data)
      .then(function(response){

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success',
            position: 'bottom-left'
          });
        });
      });
    };

    $scope.setPhoto = function(event, photo)
    {
      restFulService.put('user/' + $scope.user.id, {photo: photo.name})
      .then(function(response){
        $scope.user.photo = response.photo;
        $scope.user.avatar = response.avatar;
        if ($rootScope.user.id == $scope.user.id) {
          $rootScope.user.avatar = response.avatar;
        }

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success',
            position: 'bottom-left'
          });
        });
      });
    };


    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Watch & Calls
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    // Si no existe el parametro id
    if($state.params.id === '')
    $location.path('error');

    // Si se cambia la foto se actualiza la foto del rootScope
    $scope.$watch('photoUpload', function(newValue, oldValue) {
      if(newValue !== undefined && newValue !== ''){
        $scope.user.avatar = newValue.avatar;
        $scope.user.photos.push(newValue.photo);
        if ($rootScope.user.id == $scope.user.id) {
          $rootScope.user.avatar = newValue.avatar;
        }
        $('#modalPhoto').modal('hide');
      }
    });

    var permissions = $rootScope.user.role.permissions;

    // if($rootScope.user.custom) {
    //   DeepDiff.observableDiff(authorizations,$rootScope.user.authorizations, function (d) {
    //     if (d.kind == 'E') {
    //       DeepDiff.applyChange(authorizations,$rootScope.user.authorizations, d);
    //     }
    //   });
    // }

    if (permissions.users._access) {
      $scope.editMode.profile = true;
    } else if ($rootScope.user.id == $state.params.id) {
      $scope.editMode.profile = true;
    }

    // Se cargan los datos del usuario
    getUser($state.params.id);

  }

}());
