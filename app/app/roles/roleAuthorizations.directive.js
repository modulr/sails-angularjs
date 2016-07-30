(function(){
    'use strict';

    angular
    .module('users')
    .controller('RoleAuthorizationsCtrl', ['$scope', 'restFulService', RoleAuthorizationsCtrl])
    .directive('roleAuthorizations', roleAuthorizations);

    function roleAuthorizations(){

        var directive = {
            restrict: 'E',
            controller: 'RoleAuthorizationsCtrl',
            scope: {
                setAuthorizations: '=',
                getAuthorizations: '='
            },
            templateUrl: 'app/roles/roleAuthorizations.html'
        };
        return directive;

    }

    function RoleAuthorizationsCtrl($scope, restFulService){

        $scope.modules = [];

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Methods
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        function getModules()
        {
            restFulService.get('module/navSettings')
            .then(function(response){
                $scope.modules = response;
            });
        }

        // function setAuthorizations(json, parent) {
        //     for (var key in json) {
        //         if (typeof (json[key]) === "object") {
        //             setAuthorizations(json[key], key);
        //         } else {
        //             $scope.modules.forEach(function(v, k) {
        //                 if (v.title === parent) {
        //                     v[key] = json[key];
        //                 }
        //                 if (v.sections !== undefined) {
        //                     v.sections.forEach(function(va, ke){
        //                         if (va.title == parent) {
        //                             va[key] = json[key];
        //                         }
        //                     });
        //                 }
        //             });
        //         }
        //     }
        // }

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
            $scope.modules.forEach(function(v, k) {
                v._access = false;
                if (v.sections !== undefined) {
                    v.sections.forEach(function(va, ke){
                        va._access = false;
                        va._write = false;
                    });
                }
            });
        }

        function setAuthorizations(json) {
            var obj = {};
            $scope.modules.forEach(function(v, k) {
                for (var key in json) {
                    if (v.title == key) {
                        v._access = json[key]._access;
                        obj = json[key];
                        //delete json[key];
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

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Watch
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $scope.$watch('setAuthorizations', function(nv,ov){
            if (nv !== undefined) {
                if ( (typeof nv === 'object') && (Object.keys(nv).length > 0) ) {
                    setAuthorizations(nv);
                } else {
                    clearAuthorizations();
                }
            } else {
                clearAuthorizations();
            }
        });

        $scope.$watch('modules', function(nv,ov) {
            if (nv !== undefined && nv.length > 0) {
                $scope.getAuthorizations = getAuthorizations();
            }
        }, true);

        getModules();

    }

})();
