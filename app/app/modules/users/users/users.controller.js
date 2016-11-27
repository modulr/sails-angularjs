(function(){
  'use strict';

  angular
  .module('users')
  .controller('UsersCtrl', ['$scope', '$state', '$translate', 'restFulService', 'errorService', 'config', UsersCtrl]);

  function UsersCtrl($scope, $state, $translate, restFulService, errorService, config){

    $scope.urlAPI = config.urlAPI;

    $scope.tableResource = {
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

    $scope.formUser = {};

    $scope.show = {
      editUser: false,
      password: false
    };

    // $scope.disabled = {
    //     btnEditUsers: true
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
        $translate(['USERS.USERNAME', 'USERS.FULLNAME', 'USERS.EMAIL', 'USERS.ROLE', 'USERS.ACTIVE', 'USERS.DATE'])
        .then(function (translations) {
          $scope.tableResource = {
            "header": [
              {'username': translations['USERS.USERNAME']},
              {'fullName': translations['USERS.FULLNAME']},
              {'email': translations['USERS.EMAIL']},
              {'role': translations['USERS.ROLE']},
              {'active': translations['USERS.ACTIVE']},
              {'createdAt': translations['USERS.DATE']}
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
    * Events
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.addUser = function()
    {
      $scope.show.editUser = false;
      $scope.show.password = true;

      $scope.formUser = {
        active: true
      };

      $('#modal').modal('show');
    };

    $scope.createUser = function(event)
    {
      if ($('#formUser').smkValidate()) {

        var btn = $(event.target);
        btn.button('loading');

        var authorizations = {};

        $scope.formUser.role = $scope.formUser.getRole.id;

        restFulService.post('user/create', $scope.formUser)
        .then(function(response){

          $scope.users.push(response);

          countUsers();

          $('#modal').modal('hide');

          $translate('USERS.MESSAGES.CREATE.SUCCESS')
          .then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });

        })
        .catch(function(err){

          if (err.status == 500) {

            var value = errorService.getRawMessageValue(err.error.raw.message);

            $translate('USERS.MESSAGES.CREATE.ERROR', { emailOrUsername: value })
            .then(function (translate) {
              $.smkAlert({
                text: translate,
                type: 'warning',
                position: 'bottom-left'
              });
            });
          }

        })
        .finally(function(){
          btn.button('reset');
        });

      }
    };

    $scope.editUser = function(row)
    {
      $scope.show.editUser = true;
      $scope.show.password = false;

      $scope.formUser = {
        index: $scope.users.indexOf(row),
        id: row.id,
        username: row.username,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        role: row.role.id,
        active: row.active,
        lock: row.lock
      };

      $('#modal').modal('show');
    };

    $scope.updateUser = function(event)
    {
      if ($('#formUser').smkValidate()) {

        var btn = $(event.target);
        btn.button('loading');

        $scope.formUser.role = $scope.formUser.getRole.id;

        restFulService.put('user/update/' + $scope.formUser.id, $scope.formUser)
        .then(function(response){

          $scope.users[$scope.formUser.index] = response;

          countUsers();

          $('#modal').modal('hide');

          $translate('USERS.MESSAGES.CREATE.SUCCESS')
          .then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });

        })
        .catch(function(err){

          if (err.status == 500) {

            var value = errorService.getRawMessageValue(err.error.raw.message);

            $translate('USERS.MESSAGES.CREATE.ERROR', { emailOrUsername: value })
            .then(function (translate) {
              $.smkAlert({
                text: translate,
                type: 'warning',
                position: 'bottom-left'
              });
            });
          }

        })
        .finally(function(){
          btn.button('reset');
        });

      }
    };

    $scope.deleteUser = function(event)
    {
      $translate(['USERS.MESSAGES.DELETE.CONFIRM', 'USERS.MESSAGES.DELETE.SUCCESS'])
      .then(function (translations) {
        $.smkConfirm({
          text: translations['USERS.MESSAGES.DELETE.CONFIRM']
        },function(res){
          if (res) {
            var btn = $(event.target);
            btn.button('loading');

            restFulService.delete('user/' + $scope.formUser.id)
            .then(function(response){

              $scope.users.splice($scope.formUser.index, 1);

              countUsers();

              $('#modal').modal('hide');

              $.smkAlert({
                text: translations['USERS.MESSAGES.DELETE.SUCCESS'],
                type: 'success',
                position: 'bottom-left'
              });

            })
            .finally(function(){
              btn.button('reset');
            });
          }
        });
      });
    };

    $scope.sendUserData = function (user)
    {
      if (user.active) {

        restFulService.get('user/sendUserData/' + user.id)
        .then(function(response){

          $translate('USERS.MESSAGES.SEND-USER-DATA.SUCCESS')
          .then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });

        })
        .catch(function(err){

          $translate('USERS.MESSAGES.SEND-USER-DATA.ERROR')
          .then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'warning',
              position: 'bottom-left'
            });
          });

        });
      }
    };

    $scope.generatePassword = function()
    {
      $scope.formUser.password = generatePassword(12, false);
    };

    $scope.goToProfile = function(userId)
    {
      $state.go('profile', { id: userId });
    };

    // $scope.selectedRow = function(row)
    // {
    //     if (!row.selected) {
    //         row.selected = true;
    //     } else {
    //         row.selected = false;
    //     }
    // };

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
    * Watch & calls
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $('#modal').on('hidden.bs.modal', function (e) {
      $scope.formUser = {};
      $scope.$apply();
    });

    getUsers();

  }

}());
