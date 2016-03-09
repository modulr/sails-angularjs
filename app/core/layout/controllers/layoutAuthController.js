(function(){
  'use strict';

  angular
  .module('layout')
  .controller('LayoutAuthCtrl', ['$scope', '$translate', 'restFulService', function($scope, $translate, restFulService){

    $scope.languages = {};
    // Se obtiene la colleccion de lenguajes
    getLanguage();

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Events
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.changeLanguage = function(lang) {
      $translate.use(lang);
    };

    /*
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    |   Methods
    |- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    function getLanguage()
    {
      restFulService.get('language')
      .then(function(response){
        $scope.languages = response;
      });
    }

  }]);

}());
