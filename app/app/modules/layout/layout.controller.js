(function(){
  'use strict';

  angular
  .module('layout')
  .controller('LayoutCtrl', ['$rootScope', '$scope', '$state', 'restFulService', function($rootScope, $scope, $state, restFulService){

    $scope.isProfile = $state.is('profile') ? true : false;

    $scope.class = {
      layout: localStorage.getItem('layout'),
      chat: false
    };

    $scope.notifications = {
      chat: 0
    };

    $rootScope.modules = [];
    $scope.submodules = [];
    $scope.breadcrumbs = [];

    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Methods
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    function getModules()
    {
      restFulService.get('module/nav')
      .then(function(response){
        setModules(response);
        setSubmodules();
        setBreadcrumbs();
      });
    }

    function setModules(modules)
    {
      var permissions = $rootScope.user.role.permissions;

      // if ($rootScope.user.custom) {
      //
      //   DeepDiff.observableDiff(permissions,$rootScope.user.permissions, function (d) {
      //     if (d.kind == 'E') {
      //       DeepDiff.applyChange(permissions,$rootScope.user.permissions, d);
      //     }
      //   });
      // }

      modules.forEach(function(module){

        if (module.title in permissions) {
          if (permissions[module.title]._access) {

            if (module.submodules !== undefined) {
              module.submodules.forEach(function(submodule, index, object){
                if (!permissions[module.title][submodule.title]._access) {
                  object.splice(index,1);
                }
              });
            }

            $rootScope.modules.push(module);
          }
        }

      });
    }

    function setSubmodules()
    {
      var partsUrl = $state.current.url.replace('^', '').substr(1).split('/');

      $scope.submodules = [];

      $rootScope.modules.forEach(function(v, k) {
        if (v.title == partsUrl[0]) {
          $scope.submodules = v.submodules;
        }
      });
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
    $scope.toggleNav = function() {
      if ($scope.class.layout === '' || $scope.class.layout === null){
        $scope.class.layout = 'min';
      } else {
        $scope.class.layout = '';
      }
      // Se guarda la clase en la variable layout en localStorage
      localStorage.setItem('layout', $scope.class.layout);
    };
    $scope.closeNav = function() {
      $scope.class.layout = 'min';
      // Se guarda la clase en la variable layout en localStorage
      localStorage.setItem('layout', $scope.class.layout);
    };

    $scope.toggleChat = function() {
      $scope.class.chat = !$scope.class.chat;
    };
    $scope.closeChat = function() {
      $scope.class.chat = false;
    };

    $scope.closeChatAndNav = function() {
      $scope.closeNav();
      $scope.closeChat();
    };

    $scope.goToProfile = function(id) {
      $state.go('profile', { id: id });
    };

    $scope.logout = function() {
      restFulService.post('auth/logout')
      .then(function(){
        // Se remueve el token y se envia al login
        localStorage.removeItem('token');
        $rootScope.user = null;
        $state.go('login');
      });
    };

    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Watch & Calls
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    // Si cambia el state se crea submodules y breadcrumb
    $rootScope.$on('$stateChangeSuccess', function() {
      setSubmodules();
      setBreadcrumbs();
      $scope.isProfile = $state.is('profile') ? true : false;
    });

    getModules();

  }]);

}());
