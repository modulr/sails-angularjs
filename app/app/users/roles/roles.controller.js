(function(){
  'use strict';

  angular
  .module('users')
  .controller('RolesCtrl', ['$scope', 'restFulService', 'rolesService', '$translate', RolesCtrl]);

  function RolesCtrl($scope, restFulService, rolesService, $translate){

    $scope.tableRoles = {
      "custom": {
        itemsPerPage: 25,
        bootstrapIcon: true
      },
      "header": [],
      "rows": []
    };

    $scope.tableUsers = {
      "custom": {
        itemsPerPage: 25,
        bootstrapIcon: true
      },
      "header": [],
      "rows": []
    };

    $scope.roles = [];
    $scope.modules = [];
    $scope.countUsers = 0;
    $scope.form = {
      config:{
        add: true,
        disabled: false
      },
      values:{}
    };

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Methods
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    function getRoles()
    {
      restFulService.get('userrole')
      .then(function(response){
        $scope.roles = response;
        $translate(['ROLES.ROLE', 'ROLES.DATE', 'USERS.USERS'])
        .then(function (translations) {
          $scope.tableRoles = {
            "header": [
              {'role': translations['ROLES.ROLE']},
              {'users': translations['USERS.USERS']},
              {'createdAt': translations['ROLES.DATE']}
            ],
            "rows": $scope.roles,
            "sortBy": "createdAt",
            "sortOrder": "dsc"
          };
        });
      });
    }

    function getModules()
    {
      restFulService.get('module/all')
      .then(function(response){
        $scope.modules = response;
      });
    }

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Events
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.create = function(event)
    {
      if ($('#form').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        $scope.form.values.authorizations = rolesService.getAuthorizations($scope.modules);

        restFulService.post('userrole/', $scope.form.values)
        .then(function(response){
          $scope.roles.push(response);
          $('#modal').modal('hide');

          $translate('MESSAGES.SUCCESS')
          .then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
        });
      }
    };

    $scope.edit = function(row)
    {
      var item = angular.copy(row);

      $scope.form = {
        values: {
          index: $scope.roles.indexOf(row),
          id: item.id,
          role: item.role,
          description: item.description,
          authorizations: item.authorizations,
          users: item.users
        },
        config: {
          add: false,
          disabled: item.lock
        }
      };

      rolesService.setAuthorizations($scope.modules, $scope.form.values.authorizations);

      $('#modal').modal('show');
    };

    $scope.update = function(event)
    {

      if ($('#form').smkValidate()) {
        var btn = $(event.target);
        btn.button('loading');

        $scope.form.values.authorizations = rolesService.getAuthorizations($scope.modules);

        restFulService.put('userrole/' + $scope.form.values.id, $scope.form.values)
        .then(function(response){

          $scope.roles[$scope.form.values.index] = response;

          $('#modal').modal('hide');

          $translate('MESSAGES.SUCCESS')
          .then(function (translate) {
            $.smkAlert({
              text: translate,
              type: 'success',
              position: 'bottom-left'
            });
          });
        })
        .finally(function(){
          btn.button('reset');
        });
      }
    };

    $scope.delete = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      restFulService.delete('userrole/' + $scope.form.values.id)
      .then(function(response){

        $scope.roles.splice($scope.form.values.index, 1);

        $('#modal').modal('hide');

        $translate('MESSAGES.SUCCESS')
        .then(function (translate) {
          $.smkAlert({
            text: translate,
            type: 'success',
            position: 'bottom-left'
          });
        });

      })
      .finally(function(){
        btn.button('reset');
      });
    };

    $('#modal').on('hidden.bs.modal', function (e) {
      if (!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.countUsers = 0;
          rolesService.clearAuthorizations($scope.modules);
          $scope.form = {
            config:{
              add: true,
              disabled: true
            },
            values:{}
          };
        });
      }
      //$('#form').smkClear();
    });

    $scope.getUsers = function(row)
    {
      $scope.role = row;
      $translate(['ROLES.DATE', 'USERS.USERNAME', 'USERS.FULLNAME'])
      .then(function (translations) {
        $scope.tableUsers = {
          "header": [
            {'avatar': ''},
            {'user': translations['USERS.USERNAME']},
            {'fullName': translations['USERS.FULLNAME']}
          ],
          "rows": row.users,
          "sortBy": "id",
          "sortOrder": "dsc"
        };
      });

      $('#modalUsers').modal('show');
    };

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Watch
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    getRoles();
    getModules();


  }

})();
