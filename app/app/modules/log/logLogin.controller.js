(function(){
  'use strict';

  angular
  .module('log')
  .filter('filterIp', function() {
    return function(string) {
      return string.replace("::", "").replace("ffff:", "");
    };
  })
  .controller('LogLoginCtrl', ['$scope', '$translate', 'restFulSocketService', '$sailsSocket', 'logService', function($scope, $translate, restFulSocketService, $sailsSocket, logService) {

    $scope.charts = {
      browser: {},
      os: {}
    };

    $scope.tableResource = {
      "custom": {
        itemsPerPage: 25,
        bootstrapIcon: true
      },
      "header": [],
      "rows": []
    };

    $scope.table = {};

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Methods
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    function getLogLogin()
    {
      // Se obtienen los datos de la grafica browsers
      restFulSocketService.get('logLogin/charts/browserFamily')
      .then(function(response){
        $scope.charts.browser = logService.makeDataChart(response, 'browserFamily', 'count');
      });

      // Se obtienen los datos de la grafica OS
      restFulSocketService.get('logLogin/charts/osFamily')
      .then(function(response){

        $scope.charts.os = logService.makeDataChart(response, 'osFamily', 'count');
      });

      // Se obtienen los datos de la tabla users
      restFulSocketService.get('logLogin/table')
      .then(function(response){
        $scope.table = response;
        $translate(['LOG.USER', 'LOG.DEVICE', 'LOG.OS', 'LOG.BROWSER', 'LOG.DATE']).then(function (translations) {
          $scope.tableResource = {
            "header": [
              {'username': translations['LOG.USER']},
              {'ip': 'IP'},
              {'device': translations['LOG.DEVICE']},
              {'os': translations['LOG.OS']},
              {'browser': translations['LOG.BROWSER']},
              {'createdAt': translations['LOG.DATE']}
            ],
            "rows": $scope.table,
            "sortBy": "createdAt",
            "sortOrder": "dsc"
          };
        });
      });
    }
    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Watch
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $sailsSocket.subscribe('loglogin',function(obj){
      if(obj.verb === 'created'){

        // Se actualiza la grafica browsers
        logService.updateDataChart($scope.charts.browser, obj.data, 'browserFamily', 'count');

        // Se actualiza la grafica OS
        logService.updateDataChart($scope.charts.os, obj.data, 'osFamily', 'count');

        // Se actualiza la tabla users
        $scope.table.push(obj.data);

      }
    });

    getLogLogin();

  }]);

}());
