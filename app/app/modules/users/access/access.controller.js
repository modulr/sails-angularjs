(function(){
  'use strict';

  angular
  .module('users')
  .controller('AccessCtrl', ['$scope', 'restFulService', '$translate', function($scope, restFulService, $translate){

    $scope.modules = [];
    $scope.module = null;

    $scope.tableRolesAccess = {
      "custom": {
        itemsPerPage: 25,
        bootstrapIcon: true
      },
      "header": [],
      "rows": []
    };
    $scope.tableRolesWrite = {
      "custom": {
        itemsPerPage: 25,
        bootstrapIcon: true
      },
      "header": [],
      "rows": []
    };
    $scope.tableUsersAccess = {
      "custom": {
        itemsPerPage: 25,
        bootstrapIcon: true
      },
      "header": [],
      "rows": []
    };
    $scope.tableUsersWrite = {
      "custom": {
        itemsPerPage: 25,
        bootstrapIcon: true
      },
      "header": [],
      "rows": []
    };

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Methods
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    function getModules()
    {
      restFulService.get('module/all')
      .then(function(response){
        console.log(response);
        $scope.modules = response;
      });
    }

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Events
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.getAccessDetail = function(item)
    {
      $scope.module = item;

      $translate(['ROLES.ROLE', 'USERS.USERS'])
      .then(function (translations) {
        $scope.tableRolesAccess = {
          "header": [
            {'role': translations['ROLES.ROLE']},
            {'users': translations['USERS.USERS']}
          ],
          "rows": item.authorizations.access.roles,
          "sortBy": "id",
          "sortOrder": "dsc"
        };
        $scope.tableRolesWrite = {
          "header": [
            {'role': translations['ROLES.ROLE']},
            {'users': translations['USERS.USERS']}
          ],
          "rows": item.authorizations.write.roles,
          "sortBy": "id",
          "sortOrder": "dsc"
        };
      });

      $translate(['USERS.USERNAME', 'USERS.FULLNAME'])
      .then(function (translations) {
        $scope.tableUsersAccess = {
          "header": [
            {'avatar': ''},
            {'user': translations['USERS.USERNAME']},
            {'fullName': translations['USERS.FULLNAME']}
          ],
          "rows": item.authorizations.access.users,
          "sortBy": "id",
          "sortOrder": "dsc"
        };
        $scope.tableUsersWrite = {
          "header": [
            {'avatar': ''},
            {'user': translations['USERS.USERNAME']},
            {'fullName': translations['USERS.FULLNAME']}
          ],
          "rows": item.authorizations.write.users,
          "sortBy": "id",
          "sortOrder": "dsc"
        };
      });

      $('#modal').modal('show');
    };

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Watch
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    getModules();


  }]);

})();
