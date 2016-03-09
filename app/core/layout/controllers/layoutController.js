(function(){
  'use strict';

  angular
  .module('layout')
  .controller('LayoutCtrl', ['$rootScope', '$scope', '$state', 'restFulService', function($rootScope, $scope, $state, restFulService){

    $scope.class = {
      layout: localStorage.getItem('layout'),
      chat: false
    };

    $rootScope.navigation = [];
    $scope.breadcrumbs = {};

    $scope.notifications = {
      chat: 0
    };

    //getUser();
    getNav();

    $('[data-toggle="tooltip"]').tooltip({container: 'body'});

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
    |   Methods
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    // function getUser()
    // {
    //   restFulService.get('user/findUserByToken')
    //   .then(function(response){
    //     $rootScope.user = response.user;
    //   });
    // }

    function getNav()
    {
      restFulService.get('module/nav')
      .then(function (response) {
        $rootScope.navigation = response;
      });
    }

    // Se crea el metodo que crea el breadcrums
    function updateBreadcrumbs()
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
    |   Watch
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    // Si entras desde la url se crea el breadcrumb
    if ($state.current.name !== '') {
      updateBreadcrumbs();
    }
    // Si cambia el state se crea el breadcrumb
    $rootScope.$on('$stateChangeSuccess', function() {
      updateBreadcrumbs();
    });

  }]);

}());
