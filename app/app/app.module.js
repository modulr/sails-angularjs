(function(){
    'use strict';

    angular
    .module('modulr', [

        // Packages
        'sails.io',
        'ui.router',
        'ngCookies',
        'ngAnimate',
        'ngSanitize',
        'pascalprecht.translate',
        'angularMoment',
        'ui.tree',
        'ngTagsInput',
        'chart.js',
        'ngTasty',
        'mdr.select2',
        'mdr.file',
        'ae-datetimepicker',

        // Layouts
        'layout',

        // Helpers
        'helpers',

        // Modules
        'errors',
        'auth',
        'settings',
        'users',
        'chat',
        'log',
        'dashboard',
        'helloWorld'

    ])
    .constant(
        'config', {
            'urlAPI': window.io.sails.url,
        }
    )
    .config(['$stateProvider', '$httpProvider', '$sailsSocketProvider', '$locationProvider', '$urlRouterProvider', '$translateProvider', function($stateProvider, $httpProvider, $sailsSocketProvider, $locationProvider, $urlRouterProvider, $translateProvider){

        /*
        |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        |   Interceptor
        |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $httpProvider.interceptors.push('interceptorService');
        // Iterate $httpProvider interceptors and add those to $sailsSocketProvider
        angular.forEach($httpProvider.interceptors, function iterator(interceptor) {
            $sailsSocketProvider.interceptors.push(interceptor);
        });

        $urlRouterProvider.deferIntercept();
        /*
        |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        |   Translate
        |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $translateProvider.useStaticFilesLoader({
            prefix: 'public/locales/',
            suffix: '.min.json'
        });
        $translateProvider.preferredLanguage('en');

        $translateProvider.useSanitizeValueStrategy('escaped');

        $translateProvider.useLocalStorage();

        /*
        |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        |   HTML5 History API
        |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        $locationProvider.html5Mode({enabled: true});
        // $locationProvider
        // .html5Mode({
        //   enabled: true,
        //   requireBase: false
        // })
        // .hashPrefix('!');

    }])
    .run(['$rootScope', '$state', '$urlRouter', 'authService', 'restFulService', function($rootScope, $state, $urlRouter, authService, restFulService){

        $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl, newState, oldState) {

            if(authService.isAuthenticated() && !angular.isDefined($rootScope.user)){

                event.preventDefault();

                restFulService.get('user/findUserByToken')
                .then(function(response){
                    $rootScope.user = response;
                    $urlRouter.sync();
                });

            }

        });

        // $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl, newState, oldState) {
        // });

        $urlRouter.listen();

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            var authorizations = [];
            var urlArray = toState.url.replace('^', '').substr(1).split('/');

            if ($rootScope.user !== undefined && $rootScope.user !== null){
                authorizations = $rootScope.user.role.authorizations;

                if($rootScope.user.custom) {
                    DeepDiff.observableDiff(authorizations,$rootScope.user.authorizations, function (d) {
                        if (d.kind == 'E') {
                            DeepDiff.applyChange(authorizations,$rootScope.user.authorizations, d);
                        }
                    });
                }
            }

            urlArray.forEach(function(v){
                var firstChar = v.substr(0,1);
                if (firstChar !== ':') {
                    if (typeof authorizations[v] === 'object') {
                        authorizations = authorizations[v];
                    } else if (v == 'error' || v == 'profile' || v == 'email_change') {
                        authorizations._access = true;
                    } else {
                        authorizations._access = false;
                    }
                }
            });

            if (authService.isAuthenticated() && !authorizations._access) {
                event.preventDefault();
                $state.go('layout.dashboard');
            }
        });

        $rootScope.$on('$stateChangeSuccess', function(event) {
            setTimeout(function(){
                $('.loading').fadeOut();
            }, 500);
        });

        // $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        // });

    }]);

}());
