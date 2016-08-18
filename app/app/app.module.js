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

      if (authService.isAuthenticated()) {
        if (toState.parent == 'layoutAuth') {
          event.preventDefault();
          $state.go('dashboard');
        } else {

          var permissions = $rootScope.user.role.permissions;
          var urlArray = toState.url.replace('^', '').substr(1).split('/');

          urlArray.forEach(function(v){
            // Si no es un parametro
            if (v.substr(0,1) !== ':') {
              if (typeof permissions[v] === 'object') {
                permissions = permissions[v];
              } else if (v == 'error' || v == 'profile' || v == 'email_change') {
                permissions._access = true;
              } else {
                permissions._access = false;
              }
            }
          });
          if (!permissions._access) {
            event.preventDefault();
            $state.go('dashboard');
          }
        }
      } else {
        if (toState.parent == 'layout') {
          event.preventDefault();
          $state.go('login');
        }
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      setTimeout(function(){
        $('.loading').fadeOut();
      }, 0);
    });

    // $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    // });

    $urlRouter.listen();

  }]);

}());
