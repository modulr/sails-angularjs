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
    'helloWorld',
    'errors',
    'auth',
    'settings',
    'users',
    'profile',
    'chat',
    'log',
    'dashboard',
    'files'

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

      if(authService.isAuthenticated()) {
        if(!angular.isDefined($rootScope.user)){
          event.preventDefault();
          restFulService.get('user/findUserByToken')
          .then(function(response){
            $rootScope.user = response;
            $urlRouter.sync();
          });
        }
      }

    });

    // $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl, newState, oldState) {
    // });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

      var nameArray = toState.name.split('.');

      if (authService.isAuthenticated()) {
        if (nameArray[0] == 'layoutAuth') {
          event.preventDefault();
          $state.go('layout.dashboard');
        }
      } else {
        if (nameArray[0] == 'layout') {
          event.preventDefault();
          $state.go('layoutAuth.login');
        }
      }

      // var authorizations = [];
      // var urlArray = toState.url.replace('^', '').substr(1).split('/');
      //
      // if ($rootScope.user !== undefined && $rootScope.user !== null){
      //     authorizations = $rootScope.user.role.authorizations;
      //
      //     if($rootScope.user.custom) {
      //         DeepDiff.observableDiff(authorizations,$rootScope.user.authorizations, function (d) {
      //             if (d.kind == 'E') {
      //                 DeepDiff.applyChange(authorizations,$rootScope.user.authorizations, d);
      //             }
      //         });
      //     }
      // }
      //
      // urlArray.forEach(function(v){
      //     // Si no es un parametro
      //     if (v.substr(0,1) !== ':') {
      //         if (typeof authorizations[v] === 'object') {
      //             authorizations = authorizations[v];
      //         } else if (v == 'error' || v == 'profile' || v == 'email_change') {
      //             authorizations._access = true;
      //         } else {
      //             authorizations._access = false;
      //         }
      //     }
      // });

      // if (authService.isAuthenticated() && !authorizations._access) {
      //     event.preventDefault();
      //     $state.go('layout.dashboard');
      // }

    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {

      if (authService.isAuthenticated()) {

        var urlArray = toState.url.replace('^', '').substr(1).split('/');

        if(!angular.isDefined($rootScope.modules)){
          
          //event.preventDefault();
          restFulService.get('module/nav')
          .then(function (response) {
            $rootScope.modules = response;

            urlArray.forEach(function(value){
              $rootScope.modules.forEach(function(v,k){
                if (value == v.title) {
                  if (v.authorizations.access.roles.indexOf($rootScope.user.role.id) < 0) {
                    $state.go('layout.dashboard');
                  }
                  return false;
                }
              });
            });

            //$urlRouter.sync();

          });
        }

      }

      setTimeout(function(){
        $('.loading').fadeOut();
      }, 0);

    });

    // $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    // });

    $urlRouter.listen();

  }]);

}());
