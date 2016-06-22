(function(){
    'use strict';

    angular
    .module('users')
    .controller('RolesCtrl', ['$scope', 'restFulService', '$translate', RolesCtrl]);

    function RolesCtrl($scope, restFulService, $translate){

        $scope.tableResource = {
            "custom": {
                itemsPerPage: 25,
                bootstrapIcon: true
            },
            "header": [],
            "rows": []
        };

        $scope.roles = [];
        $scope.modules = [];
        $scope.countUsers = 0;

        $scope.formRole = {};

        $scope.show = {
            editRole: false
        };

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Methods
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        function getRoles()
        {
            restFulService.get('userrole')
            .then(function(response){
                $scope.roles = response;
                $translate(['ROLES.ROLE', 'ROLES.DATE'])
                .then(function (translations) {
                    $scope.tableResource = {
                        "header": [
                            {'role': translations['ROLES.ROLE']},
                            {'createdAt': translations['ROLES.DATE']},
                            {'id': ''}
                        ],
                        "rows": $scope.roles,
                        "sortBy": "createdAt",
                        "sortOrder": "dsc"
                    };
                });
            });
        }

        function getCountUsers(roleId)
        {
            restFulService.post('user/findByRole/' + roleId)
            .then(function(response){
                $scope.countUsers = response;
            });
        }

        function getModules()
        {
            restFulService.get('module/navSettings')
            .then(function(response){
                $scope.modules = response;
            });
        }

        // function setAuthorizations(json, parent) {
        //   for (var key in json) {
        //     if (typeof (json[key]) === "object") {
        //       setAuthorizations(json[key], key);
        //     } else {
        //       $scope.modules.forEach(function(v, k) {
        //         if (v.title === parent) {
        //           v[key] = json[key];
        //         }
        //         if (v.sections !== undefined) {
        //           v.sections.forEach(function(va, ke){
        //             if (va.title == parent) {
        //               va[key] = json[key];
        //             }
        //           });
        //         }
        //       });
        //     }
        //   }
        // }

        function setAuthorizations(json) {
            var obj = {};
            $scope.modules.forEach(function(v, k) {
                for (var key in json) {
                    if (v.title == key) {
                        v._access = json[key]._access;
                        obj = json[key];
                        delete json[key];
                        break;
                    } else {
                        v._access = false;
                    }
                }
                if (v.sections !== undefined) {
                    v.sections.forEach(function(va, ke) {
                        for (var index in obj) {
                            if (va.title == index) {
                                va._access = obj[index]._access;
                                va._write = obj[index]._write;
                                break;
                            } else {
                                va._access = false;
                                va._write = false;
                            }
                        }
                    });
                }
            });
        }

        function getAuthorizations()
        {
            var authorizations = {};
            $scope.modules.forEach(function(v, k) {
                if (v._access === undefined) {
                    v._access = false;
                }
                authorizations[v.title] = {_access: v._access};
                if (v.sections !== undefined) {
                    v.sections.forEach(function(va, ke){
                        if (va._access === undefined) {
                            va._access = false;
                        }
                        if (va._write === undefined) {
                            va._write = false;
                        }
                        authorizations[v.title][va.title] = {_access: va._access, _write: va._write};
                    });
                }
            });
            return authorizations;
        }

        function clearAuthorizations()
        {
            var authorizations = {};
            $scope.modules.forEach(function(v, k) {
                v._access = false;
                authorizations[v.title] = {_access: v._access};
                if (v.sections !== undefined) {
                    v.sections.forEach(function(va, ke){
                        va._access = false;
                        va._write = false;
                        authorizations[v.title][va.title] = {_access: va._access, _write: va._write};
                    });
                }
            });
            return authorizations;
        }

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Events
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $scope.createRole = function(event)
        {
            if ($('#formRole').smkValidate()) {
                var btn = $(event.target);
                btn.button('loading');

                $scope.formRole.authorizations = getAuthorizations();

                restFulService.post('userrole/', $scope.formRole)
                .then(function(response){
                    $scope.roles.push(response);
                    $('#modalRole').modal('hide');

                    $translate('MESSAGES.SUCCESS')
                    .then(function (translate) {
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
            }
        };

        $scope.editRole = function(row)
        {
            $scope.show.editRole = true;

            $scope.formRole = {
                index: $scope.roles.indexOf(row),
                id: angular.copy(row.id),
                role: angular.copy(row.role),
                authorizations: angular.copy(row.authorizations)
            };

            setAuthorizations($scope.formRole.authorizations);

            getCountUsers(row.id);

            $('#modalRole').modal('show');
        };

        $scope.updateRole = function(event)
        {
            if ($('#formRole').smkValidate()) {
                var btn = $(event.target);
                btn.button('loading');

                $scope.formRole.authorizations = getAuthorizations();

                restFulService.put('userrole/' + $scope.formRole.id, $scope.formRole)
                .then(function(response){

                    $scope.roles[$scope.formRole.index] = response;

                    $('#modalRole').modal('hide');

                    $translate('MESSAGES.SUCCESS')
                    .then(function (translate) {
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
            }
        };

        $scope.deleteRole = function(event)
        {
            var btn = $(event.target);
            btn.button('loading');

            restFulService.delete('userrole/' + $scope.formRole.id)
            .then(function(response){

                $scope.roles.splice($scope.formRole.index, 1);

                $('#modalRole').modal('hide');

                $translate('MESSAGES.SUCCESS')
                .then(function (translate) {
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
        * Watch
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $('#modalRole').on('hidden.bs.modal', function (e) {
            if (!$scope.$$phase) {
                $scope.$apply(function() {
                    $scope.show.editRole = false;
                    $scope.countUsers = 0;
                    clearAuthorizations();
                    $scope.formRole = {};
                });
            }
            $('#formRole').smkClear();
        });

        getRoles();
        getModules();


    }

})();
