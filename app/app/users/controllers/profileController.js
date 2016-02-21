(function(){
  'use strict';

  angular
  .module('users')
  .controller('ProfileCtrl', ['$rootScope', '$scope', '$state', '$location', '$translate', 'restFulService', 'config', 'errorService', function($rootScope, $scope, $state, $location, $translate, restFulService, config, errorService){

    $scope.apiUrl = config.apiUrl;
    $scope.token =  localStorage.getItem('token');

    $scope.user = {};

    $scope.formName = {};
    $scope.formPersonal = {
      gender: {gender: null},
      relationship: {relationship: null}
    };
    $scope.formPlace = {
      currently: true
    };
    $scope.formEducation = {};
    $scope.formFamily = {};
    $scope.formContact = {};
    $scope.formWork = {};
    $scope.formAccount = {};
    $scope.formPassword = {};

    $scope.editMode = {
      name: false
    };
    $scope.show = {
      btnContact: false,
      btnPlace: false,
      btnEducation: false,
      btnFamily: false
    };

    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Watch
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    // Si no existe el parametro id
    if($state.params.id === '')
      $location.path('error');

    // Se cargan los datos del usuario
    getUser($state.params.id);

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

    $('#modalContact').on('hidden.bs.modal', function (e) {
      if (!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.show.btnContact = false;
          $scope.formContact = {};
        });
      }
      $('#formContact').smkClear();
    });

    $('#modalPlace').on('hidden.bs.modal', function (e) {
      if (!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.show.btnPlace = false;
          $scope.formPlace = {
            currently: true
          };
        });
      }
      $('#formPlace').smkClear();
    });

    $('#modalEducation').on('hidden.bs.modal', function (e) {
      if (!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.show.btnEducation = false;
          $scope.formEducation = {};
        });
      }
      $('#formEducation').smkClear();
    });

    $('#modalFamily').on('hidden.bs.modal', function (e) {
      if (!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.show.btnFamily = false;
          $scope.formFamily = {};
        });
      }
      $('#formFamily').smkClear();
    });

    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Events
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.editName = function()
    {
      $scope.editMode.name = !$scope.editMode.name;

      $scope.formName = {
        firstName: $scope.user.profile.firstName,
        lastName: $scope.user.profile.lastName,
      };
    };
    $scope.cancelName = function()
    {
      $scope.editMode.name = false;
    };
    $scope.saveName = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      restFulService.put('profile/' + $scope.user.profile.id, $scope.formName)
      .then(function(response){

        $scope.user.profile.firstName = response.firstName;
        $scope.user.profile.lastName = response.lastName;

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success'
          });
        });
      })
      .finally(function(){
        btn.button('reset');
        $scope.editMode.name = false;
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
            type: 'success'
          });
        });
      });
    };

    $scope.savePersonal = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      $scope.formPersonal.gender = $scope.formPersonal.gender.gender;
      $scope.formPersonal.relationship = $scope.formPersonal.relationship.relationship;

      restFulService.put('profile/' + $scope.user.profile.id, $scope.formPersonal)
      .then(function(response){

        $scope.user.profile.gender = response.gender;
        $scope.user.profile.relationship = response.relationship;

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success'
          });
        });
      })
      .finally(function(){
        btn.button('reset');
      });
    };

    $scope.createContact = function(event)
    {
      if ($('#formContact').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        $scope.formContact.userId = $scope.user.id;
        $scope.formContact.type = $scope.formContact.select.type.type;

        restFulService.post('contact', $scope.formContact)
        .then(function(response){

          $scope.user.contact.push(response);

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalContact').modal('hide');
        });
      }
    };

    $scope.editContact = function(item)
    {
      $scope.show.btnContact = true;
      $scope.formContact = angular.copy(item);
      $('#modalContact').modal('show');
    };

    $scope.saveContact = function(event)
    {
      if ($('#formContact').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        var id = $scope.formContact.id;
        $scope.formContact.id = undefined;
        $scope.formContact.type = $scope.formContact.select.type.type;

        restFulService.put('contact/' + id, $scope.formContact)
        .then(function(response){

          $scope.user.contact.forEach(function(val, key) {
            if (val.id == id) {
              $scope.user.contact[key].contact = $scope.formContact.contact;
              $scope.user.contact[key].type = $scope.formContact.type;
              return false;
            }
          });

          //$scope.user.contact[$scope.formContact.index] = response;

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalContact').modal('hide');
        });
      }
    };

    $scope.deleteContact = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      restFulService.delete('contact/' + $scope.formContact.id)
      .then(function(response){

        $scope.user.contact.forEach(function(val, key) {
          if (val.id == $scope.formContact.id) {
            $scope.user.contact.splice(key, 1);
            return false;
          }
        });

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success'
          });
        });
      })
      .finally(function(){
        btn.button('reset');
        $('#modalContact').modal('hide');
      });
    };

    $scope.createPlace = function(event)
    {
      if ($('#formPlace').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        $scope.formPlace.userId = $scope.user.id;

        restFulService.post('place', $scope.formPlace)
        .then(function(response){

          $scope.user.place.push(response);

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalPlace').modal('hide');
        });
      }
    };

    $scope.editPlace = function(item, index)
    {
      $scope.show.btnPlace = true;
      $scope.formPlace = angular.copy(item);
      $scope.formPlace.index = index;
      $('#modalPlace').modal('show');
    };

    $scope.savePlace = function(event)
    {
      if ($('#formPlace').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        var id = $scope.formPlace.id;
        $scope.formPlace.id = undefined;

        restFulService.put('place/' + id, $scope.formPlace)
        .then(function(response){

          $scope.user.place[$scope.formPlace.index] = response;

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalPlace').modal('hide');
        });
      }
    };

    $scope.deletePlace = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      restFulService.delete('place/' + $scope.formPlace.id)
      .then(function(response){

        $scope.user.place.splice($scope.formPlace.index, 1);

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success'
          });
        });
      })
      .finally(function(){
        btn.button('reset');
        $('#modalPlace').modal('hide');
      });
    };

    $scope.createEducation = function(event)
    {
      if ($('#formEducation').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        $scope.formEducation.userId = $scope.user.id;

        restFulService.post('education', $scope.formEducation)
        .then(function(response){

          $scope.user.education.push(response);

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalEducation').modal('hide');
        });
      }
    };

    $scope.editEducation = function(item, index)
    {
      $scope.show.btnEducation = true;
      $scope.formEducation = angular.copy(item);
      $scope.formEducation.index = index;
      $('#modalEducation').modal('show');
    };

    $scope.saveEducation = function(event)
    {
      if ($('#formEducation').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        var id = $scope.formEducation.id;
        $scope.formEducation.id = undefined;

        restFulService.put('education/' + id, $scope.formEducation)
        .then(function(response){

          $scope.user.education[$scope.formEducation.index] = response;

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalEducation').modal('hide');
        });
      }
    };

    $scope.deleteEducation = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      restFulService.delete('education/' + $scope.formEducation.id)
      .then(function(response){

        $scope.user.education.splice($scope.formEducation.index, 1);

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success'
          });
        });
      })
      .finally(function(){
        btn.button('reset');
        $('#modalEducation').modal('hide');
      });
    };

    $scope.createFamily = function(event)
    {
      if ($('#formFamily').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        $scope.formFamily.userId = $scope.user.id;
        $scope.formFamily.relation = $scope.formFamily.select.relation.relation;
        restFulService.post('family', $scope.formFamily)
        .then(function(response){

          $scope.user.family.push(response);

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalFamily').modal('hide');
        });
      }
    };

    $scope.editFamily = function(item, index)
    {
      $scope.show.btnFamily = true;
      $scope.formFamily = angular.copy(item);
      $scope.formFamily.datepicker = {
        birthday: angular.copy(item.birthday)
      };
      $scope.formFamily.index = index;
      $('#modalFamily').modal('show');
    };

    $scope.saveFamily = function(event)
    {
      if ($('#formFamily').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        var id = $scope.formFamily.id;
        $scope.formFamily.id = undefined;
        $scope.formFamily.relation = $scope.formFamily.select.relation.relation;

        restFulService.put('family/' + id, $scope.formFamily)
        .then(function(response){

          $scope.user.family[$scope.formFamily.index] = response;

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
          $('#modalFamily').modal('hide');
        });
      }
    };

    $scope.deleteFamily = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      restFulService.delete('family/' + $scope.formFamily.id)
      .then(function(response){

        $scope.user.family.splice($scope.formFamily.index, 1);

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success'
          });
        });
      })
      .finally(function(){
        btn.button('reset');
        $('#modalFamily').modal('hide');
      });
    };

    $scope.saveWork = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      $scope.formWork.job = $scope.formWork.select.job.job;
      $scope.formWork.department = $scope.formWork.select.department.department;
      $scope.formWork.company = $scope.formWork.select.company.company;

      restFulService.put('profile/' + $scope.user.profile.id, $scope.formWork)
      .then(function(response){

        $scope.user.profile.job = response.job;
        $scope.user.profile.department = response.department;
        $scope.user.profile.company = response.company;

        $translate('MESSAGES.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success'
          });
        });
      })
      .finally(function(){
        btn.button('reset');
      });
    };

    $scope.saveAccount = function(event)
    {
      if($('#formAccount').smkValidate()){

        var btn = $(event.target);
        btn.button('loading');

        $scope.formAccount.username = $scope.user.username;
        $scope.formAccount.email = $scope.user.email;
        $scope.formAccount.language = $scope.formAccount.select.language.language;
        $scope.formAccount.lang = $scope.formAccount.select.language.lang;

        restFulService.put('user/' + $scope.user.id, $scope.formAccount)
        .then(function(response){

          $scope.user.username = response.username;
          $scope.user.email = response.email;
          $scope.user.language = response.language;
          $scope.user.lang = response.lang;

          if ($rootScope.user.id == $scope.user.id) {
            $translate.use(response.lang);
          }

          $translate('MESSAGES.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success'
            });
          });
        })
        .catch(function(error){
          if (error.status == 500) {
            var value = errorService.getRawMessageValue(error.error.raw.message);
            $translate('PROFILE.MESSAGES.ACCOUNT.ERROR', { username: value }).then(function (translate) {
              $.smkAlert({
                text: translate,
                type: 'warning'
              });
            });
          }
        })
        .finally(function(){
          btn.button('reset');
        });
      }
    };

    $scope.deactivateAccount = function($event)
    {
      $translate(['PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.TEXT','PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.BTNACCEPT','PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.BTNCANCEL','PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.SUCCESS']).then(function (translations) {
        $.smkConfirm({
          text: translations['PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.TEXT'],
          accept: translations['PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.BTNACCEPT'],
          cancel: translations['PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.BTNCANCEL']
        }, function(e){if(e){
          var btn = $(event.target);
          btn.button('loading');

          restFulService.put('user/' + $scope.user.id, { active: false })
          .then(function(response){

            $scope.user.active = response.active;

            $.smkAlert({
              text: translations['PROFILE.MESSAGES.DEACTIVATEACCOUNT.CONFIRM.SUCCESS'],
              type: 'success'
            });
          })
          .finally(function(){
            btn.button('reset');
          });
        }});
      });
    };

    $scope.savePassword = function($event)
    {
      if($('#formPassword').smkValidate()){
        if( $.smkEqualPass('#password', '#rePassword') ){

          var btn = $(event.target);
          btn.button('loading');

          // Se actualiza el profile
          restFulService.put('user/updatePassword/' + $scope.user.id, $scope.formPassword)
          .then(function(response){
            $translate('PROFILE.MESSAGES.CHANGEPASSWORD.SUCCESS').then(function (translate) {
              $.smkAlert({
                text: translate,
                type: 'success'
              });
            });
            $scope.formPassword = {};
          })
          .catch(function(error){
            if (error.status == 400) {
              $translate('PROFILE.MESSAGES.CHANGEPASSWORD.ERROR').then(function (translate) {
                $.smkAlert({
                  text: translate,
                  type: 'warning'
                });
              });
            }
          })
          .finally(function(){
            btn.button('reset');
          });

        }
      }
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


  }]);

}());
