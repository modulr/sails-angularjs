(function(){
    'use strict';

    angular
    .module('layout')
    .controller('LayoutCtrl', ['$rootScope', '$scope', '$state', 'restFulService', function($rootScope, $scope, $state, restFulService){

        $scope.class = {
            layout: localStorage.getItem('layout'),
            chat: false
        };

        $scope.notifications = {
            chat: 0
        };

        $scope.breadcrumbs = [];
        $scope.modules = [];
        $scope.sections = [];

        $('[data-toggle="tooltip"]').tooltip({container: 'body'});

        /*
        |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        |   Methods
        |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */

        function getModules()
        {
            restFulService.get('module/nav')
            .then(function (response) {

                setModules(response);

                setSections();
            });
        }

        function setModules(modules)
        {
            var authorizations = $rootScope.user.role.authorizations;

            if ($rootScope.user.custom) {

                DeepDiff.observableDiff(authorizations,$rootScope.user.authorizations, function (d) {
                    if (d.kind == 'E') {
                        DeepDiff.applyChange(authorizations,$rootScope.user.authorizations, d);
                    }
                });
            }

            modules.forEach(function(v){

                if (v.title in authorizations) {
                    if (authorizations[v.title]._access ) {

                        if (v.sections !== undefined) {
                            v.sections.forEach(function(va, ke, object){
                                if (!authorizations[v.title][va.title]._access) {
                                    object.splice(ke,1);
                                }
                            });
                        }

                        $scope.modules.push(v);
                    }
                }

            });
        }

        function setSections()
        {
            if ($state.current.name !== 'layout.profile') {
                $scope.modules.forEach(function(v, k){
                    if (v.state == $state.current.name) {
                        $scope.sections = v.sections;
                    }
                });
            } else {
                $scope.sections = [];
            }

        }

        // Se crea el metodo que crea el breadcrums
        function setBreadcrumbs()
        {
            var breadcrumbs = [];
            var partsUrl = $state.current.url.replace('^', '').substr(1).split('/');

            $.each(partsUrl, function(key,val){
                var firstChar = val.substr(0,1);
                if(firstChar !== ':'){
                    breadcrumbs.push({
                        name: val,
                        url: '/' + val
                    });
                }
            });

            $scope.breadcrumbs = breadcrumbs;
        }

        /*
        |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        |   Events
        |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $scope.toggleClassLayout = function() {

            if ($scope.class.layout === '' || $scope.class.layout === null){
                $scope.class.layout = 'min';
            } else {
                $scope.class.layout = '';
            }
            // Se guarda la clase en la variable layout en localStorage
            localStorage.setItem('layout', $scope.class.layout);

        };

        $scope.logout = function() {
            restFulService.post('auth/logout')
            .then(function(){
                // Se remueve el token y se envia al login
                localStorage.removeItem('token');
                $rootScope.user = null;
                $state.go('layoutAuth.login');
            });
        };

        $scope.goToProfile = function(id) {
            $state.go('layout.profile', { id: id });
        };

        /*
        |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        |   Watch & Calls
        |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        // Si entras desde la url se crea el breadcrumb
        if ($state.current.name !== '') {
            setBreadcrumbs();
            setSections();
        }
        // Si cambia el state se crea el breadcrumb
        $rootScope.$on('$stateChangeSuccess', function() {
            setBreadcrumbs();
            setSections();
        });

        getModules();

    }]);

}());
