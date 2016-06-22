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

        $scope.formUser = {
            active: true
        };

        $scope.show = {
            editUser: false
        };

        // $scope.editMode = {
        //     users: 'disabled'
        // };

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Methods
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        function getUsers()
        {
            restFulService.get('user/findWithRole')
            .then(function(response){
                console.log(response);
                $scope.users = response;
                $translate(['USERS.USERNAME', 'USERS.EMAIL', 'USERS.ROLE', 'USERS.ACTIVE', 'USERS.DATE'])
                .then(function (translations) {
                    $scope.tableResource = {
                        "header": [
                            {'avatar': ''},
                            {'username': translations['USERS.USERNAME']},
                            {'email': translations['USERS.EMAIL']},
                            {'role': translations['USERS.ROLE']},
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
        * Events
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $scope.createUser = function(event)
        {
            if ($('#formUser').smkValidate()) {

                var btn = $(event.target);
                btn.button('loading');

                $scope.formUser.role = $scope.formUser.role.id;

                restFulService.post('user/create', $scope.formUser)
                .then(function(response){

                    $scope.users.push(response);

                    countUsers();

                    $('#modalCreateUser').modal('hide');

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

            $scope.formUser = {
                index: $scope.users.indexOf(row),
                id: angular.copy(row.id),
                username: angular.copy(row.username),
                email: angular.copy(row.email),
                role: angular.copy(row.role),
                setAuthorizations: angular.copy(row.authorizations),
                active: angular.copy(row.active)
            };

            $('#modalUser').modal('show');
        };

        $scope.updateUser = function(event)
        {
            if ($('#formUser').smkValidate()) {

                var btn = $(event.target);
                btn.button('loading');

                console.log($scope.formUser);

                //$scope.formUser.role = $scope.formUser.role.id;

                // restFulService.put('user/update/' + $scope.formUser.id, $scope.formUser)
                // .then(function(response){
                //
                //     $scope.users.push(response);
                //
                //     $('#modalCreateUser').modal('hide');
                //
                //     $translate('USERS.MESSAGES.CREATE.SUCCESS')
                //     .then(function (translate) {
                //         $.smkAlert({
                //             text: translate,
                //             type: 'success',
                //             position: 'bottom-left'
                //         });
                //     });
                //
                // })
                // .catch(function(err){
                //
                //     if (err.status == 500) {
                //
                //         var value = errorService.getRawMessageValue(err.error.raw.message);
                //
                //         $translate('USERS.MESSAGES.CREATE.ERROR', { emailOrUsername: value })
                //         .then(function (translate) {
                //             $.smkAlert({
                //                 text: translate,
                //                 type: 'warning',
                //                 position: 'bottom-left'
                //             });
                //         });
                //     }
                //
                // })
                // .finally(function(){
                //     btn.button('reset');
                // });

            }
        };

        $scope.activateUser = function(user)
        {
            restFulService.put('user/update/' + user.id, { active: true })
            .then(function(response){

                user.active = response.active;

                countUsers();

                $translate('USERS.MESSAGES.ACTIVATE.SUCCESS')
                .then(function (translate) {
                    $.smkAlert({
                        text: translate,
                        type: 'success',
                        position: 'bottom-left'
                    });
                });

            });
        };

        $scope.deactivateUser = function(user)
        {
            restFulService.put('user/update/' + user.id, { active: false })
            .then(function(response){

                user.active = response.active;

                countUsers();

                $translate('USERS.MESSAGES.DEACTIVATE.SUCCESS')
                .then(function (translate) {
                    $.smkAlert({
                        text: translate,
                        type: 'success',
                        position: 'bottom-left'
                    });
                });

            });
        };

        $scope.deleteUser = function(user)
        {
            $translate(['USERS.MESSAGES.DELETE.CONFIRM', 'USERS.MESSAGES.DELETE.SUCCESS'])
            .then(function (translations) {
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
                                type: 'success',
                                position: 'bottom-left'
                            });

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
            $state.go('layout.profile', { id: userId });
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
        * Watch
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $scope.$watch('formUser.role', function(nv,ov){
            console.log(ov);
            console.log(nv);

            if ( (typeof nv === 'object') && (Object.keys(nv).length > 0) ) {
                //console.log(nv);
            }
        });

        $('#modalCreateUser').on('hide.bs.modal', function (e) {
            $('#formUser').smkClear();
        });

        getUsers();

    }

}());
