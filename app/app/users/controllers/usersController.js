(function(){
  'use strict';

  angular
  .module('users')
  .controller('UsersCtrl', ['$rootScope', '$scope', '$state', '$translate', 'restFulService', 'errorService', function($rootScope, $scope, $state, $translate, restFulService, errorService){

    $scope.resource = {
      "custom": {
        itemsPerPage: 25,
        bootstrapIcon: true
      },
      "header": [],
      "rows": []
    };

    $scope.users = [];

    $scope.countUsers = {
      total: 0,
      active: 0,
      deactive: 0
    };

    $scope.formCreateUser = {
      active: true
    };

    $scope.editMode = {
      users: 'disabled'
    };

    getUsers();

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Events
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.createUser = function(event)
    {
      if ($('#formCreateUser').smkValidate()) {

        var btn = $(event.target);
        btn.button('loading');

        restFulService.post('user/create', $scope.formCreateUser)
        .then(function(response){

          $scope.users.push(response);

          countUsers();

          $('#modalCreateUser').modal('hide');

          $translate('USERS.MESSAGES.CREATE.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success'
            });
          });

        })
        .catch(function(err){

          if (err.status == 500) {

            var value = errorService.getRawMessageValue(err.error.raw.message);

            $translate('USERS.MESSAGES.CREATE.ERROR', { emailOrUsername: value }).then(function (translate) {
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
    $scope.generatePassword = function(event)
    {
      $scope.formCreateUser.password = generatePassword(12, false);
    };
    $scope.activateUser = function(event, user)
    {
      restFulService.put('user/update/' + user.id, { active: true })
      .then(function(response){

        user.active = response.active;

        countUsers();

        $translate('USERS.MESSAGES.ACTIVATE.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success',
            position: 'bottom-left'
          });
        });

      });
    };
    $scope.deactivateUser = function(event, user)
    {
      restFulService.put('user/update/' + user.id, { active: false })
      .then(function(response){

        user.active = response.active;

        countUsers();

        $translate('USERS.MESSAGES.DEACTIVATE.SUCCESS').then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success',
            position: 'bottom-left'
          });
        });

      });
    };
    $scope.goToProfile = function(userId)
    {
      $state.go('layout.profile', { id: userId });
    };
    $scope.deleteUser = function(event, user)
    {
      $translate(['USERS.MESSAGES.DELETE.CONFIRM', 'USERS.MESSAGES.DELETE.SUCCESS']).then(function (translations) {
        $.smkConfirm({
          text: translations['USERS.MESSAGES.DELETE.CONFIRM']
        },function(res){
          if (res) {
            restFulService.delete('user/' + user.id)
            .then(function(response){

              $scope.users.forEach(function(val, key) {
                if (val.id == user.id) {
                  $scope.users.splice(key, 1);
                  return false;
                }
              });

              countUsers();

              $.smkAlert({
                text: translations['USERS.MESSAGES.DELETE.SUCCESS'],
                type: 'success'
              });

            });
          }
        });
      });
    };
    $scope.sendUserData = function (event, user)
    {
      if (user.active) {
        restFulService.get('user/sendUserData/' + user.id)
        .then(function(response){

          $translate('USERS.MESSAGES.SEND-USER-DATA.SUCCESS').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success'
            });
          });

        })
        .catch(function(err){

          $translate('USERS.MESSAGES.SEND-USER-DATA.ERROR').then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'warning'
            });
          });

        });
      }
    };

    // $scope.activateUsers = function(event)
    // {
    //   var btn = $(event.target);
    //
    //   if(!btn.parent('li').hasClass('disabled')){
    //
    //     var data = {
    //       ids: $scope.checked,
    //       values: {
    //         active: true
    //       }
    //     };
    //
    //     restFulService.post('user/updateUsers', data)
    //     .then(function(response){
    //
    //       data.ids.forEach(function(v,k){
    //         $scope.users.forEach(function(va,ke){
    //           if (v == va.id) {
    //             va.active = true;
    //           }
    //         });
    //       });
    //
    //       countUsers();
    //
    //       $translate('USERS.MESSAGES.ACTIVATES.SUCCESS').then(function (translate) {
    //         $.smkAlert({
    //           text: translate,
    //           type: 'success',
    //           position: 'bottom-left'
    //         });
    //       });
    //
    //     });
    //   }
    // };
    // $scope.deactivateUsers = function(event)
    // {
    //   var btn = $(event.target);
    //
    //   if(!btn.parent('li').hasClass('disabled')){
    //
    //     var data = {
    //       ids: $scope.checked,
    //       values: {
    //         active: false
    //       }
    //     };
    //
    //     restFulService.post('user/updateUsers', data)
    //     .then(function(response){
    //
    //       data.ids.forEach(function(v,k){
    //         $scope.users.forEach(function(va,ke){
    //           if (v == va.id) {
    //             va.active = false;
    //           }
    //         });
    //       });
    //
    //       countUsers();
    //
    //       $translate('USERS.MESSAGES.DEACTIVATES.SUCCESS').then(function (translate) {
    //         $.smkAlert({
    //           text: translate,
    //           type: 'success',
    //           position: 'bottom-left'
    //         });
    //       });
    //
    //     });
    //   }
    // };
    // $scope.deleteUsers = function (event)
    // {
    //   var btn = $(event.target);
    //
    //   if(!btn.parent('li').hasClass('disabled')){
    //
    //     var now = moment().format();
    //
    //     var data = {
    //       ids: $scope.checked,
    //       values: {
    //         active: false,
    //         deletedAt: now
    //       }
    //     };
    //
    //     restFulService.post('user/updateUsers', data)
    //     .then(function(response){
    //
    //       data.ids.forEach(function(v, k) {
    //         $scope.users.forEach(function(va, ke) {
    //           if (v == va.id) {
    //             $scope.users.splice(ke, 1);
    //           }
    //         });
    //       });
    //
    //       countUsers();
    //
    //       $translate('USERS.MESSAGES.DELETES.SUCCESS').then(function (translate) {
    //         $.smkAlert({
    //           text: translate,
    //           type: 'success',
    //           position: 'bottom-left'
    //         });
    //       });
    //
    //     });
    //   }
    // };

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Methods
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    function getUsers()
    {
      restFulService.get('user')
      .then(function(response){
        $scope.users = response;
        $translate(['USERS.USERNAME', 'USERS.EMAIL', 'USERS.ACTIVE', 'USERS.DATE']).then(function (translations) {
          $scope.resource = {
            "header": [
              {'avatar': ''},
              {'username': translations['USERS.USERNAME']},
              {'email': translations['USERS.EMAIL']},
              {'active': translations['USERS.ACTIVE']},
              {'createdAt': translations['USERS.DATE']},
              {'id': ''}
            ],
            "rows": $scope.users,
            "sortBy": "createdAt",
            "sortOrder": "dsc"
          };
        });
        countUsers();
      });
    }

    function countUsers()
    {
      if ($scope.users.length > 0) {
        $scope.countUsers.total = $scope.users.length;
        $scope.countUsers.active = 0;
        $scope.countUsers.deactive = 0;
        // Se obtiene el numero de usuarios activos y no activos
        $scope.users.forEach(function(v) {
          if(v.active){
              $scope.countUsers.active++;
          }else{
              $scope.countUsers.deactive++;
          }
        });
      }
    }

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Watch
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $('#modalCreateUser').on('hide.bs.modal', function (e) {
      $('#formCreateUser').smkClear();
    });

  }]);

}());
