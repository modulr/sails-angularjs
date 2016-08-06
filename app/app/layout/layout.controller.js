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

    $scope.navigation = [];
    $scope.breadcrumbs = [];
    $scope.submodules = [];

    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Methods
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    function setNavigation(modules)
    {
      modules.forEach(function(v,k){
        if (v.authorizations.access.roles.indexOf($rootScope.user.role.id) >= 0) {
          $scope.navigation.push(v);
        }
      });

      setSubmodules();

      setBreadcrumbs();

      // var authorizations = $rootScope.user.role.authorizations;
      //
      // if ($rootScope.user.custom) {
      //
      //   DeepDiff.observableDiff(authorizations,$rootScope.user.authorizations, function (d) {
      //     if (d.kind == 'E') {
      //       DeepDiff.applyChange(authorizations,$rootScope.user.authorizations, d);
      //     }
      //   });
      // }
      //
      // modules.forEach(function(v){
      //
      //   if (v.title in authorizations) {
      //     if (authorizations[v.title]._access ) {
      //
      //       if (v.sections !== undefined) {
      //         v.sections.forEach(function(va, ke, object){
      //           if (!authorizations[v.title][va.title]._access) {
      //             object.splice(ke,1);
      //           }
      //         });
      //       }
      //
      //       $rootScope.modules.push(v);
      //     }
      //   }
      //
      // });
    }

    function setSubmodules()
    {
      var urlArray = $state.current.url.replace('^', '').substr(1).split('/');

      $scope.submodules = [];

      $rootScope.modules.forEach(function(v, k) {
        //if (v.state == $state.current.name) {
        if (v.title == urlArray[0]) {
          $scope.submodules = v.children;
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
    $scope.toggleClassLayout = function() {

      if ($scope.class.layout === '' || $scope.class.layout === null){
        $scope.class.layout = 'min';
      } else {
        $scope.class.layout = '';
      }
      // Se guarda la clase en la variable layout en localStorage
      localStorage.setItem('layout', $scope.class.layout);

    };

    $scope.close = function() {
      $scope.class.chat = false;
      //$scope.class.layout = 'min';
    };

    $scope.goToProfile = function(id) {
      $state.go('layout.profile', { id: id });
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

    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Watch & Calls
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    // Si cambia el state se crea submodules y breadcrumb
    $rootScope.$on('$stateChangeSuccess', function() {
      setSubmodules();
      setBreadcrumbs();
    });

    $rootScope.$watch('modules', function(nv,ov){
      if (nv !== undefined && $state.current.name !== '') {
        setNavigation(nv);
      }
    });

  }]);

}());
