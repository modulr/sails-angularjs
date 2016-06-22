(function(){
  'use strict';

  angular
  .module('users')
  .controller('AccessCtrl', ['$rootScope', '$scope', 'restFulService', 'config', '$filter', '$translate', function($rootScope, $scope, restFulService, config, $filter, $translate){

    $scope.urlAPI = config.urlAPI;

    $scope.modules = [];
    $scope.tags = {
      department: [],
      job: [],
      user: []
    };
    $scope.select = {
      role: {}
    };

    var lastUser = null;

    getModules();
    getDepartment();
    getJob();
    getUser();

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Events
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.save = function(event)
    {
      var btn = $(event.target);
      btn.button('loading');

      var authorizations = getAuthorizations();

      console.log(authorizations);

      console.log($scope.select.role);

      $scope.tags.user.forEach(function(v,k){
        restFulService.put('user/' + v.id, {'role': $scope.select.role.role, 'authorizations': authorizations})
        .then(function(response){
          v.authorizations = response.authorizations;
          $translate('MESSAGES.SUCCESS').then(function (translate) {
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
      });
    };

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Methods
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    function getModules()
    {
      restFulService.get('module/nav')
      .then(function(response){
        $scope.modules = response;
      });
    }

    function getDepartment()
    {
      restFulService.get('department')
      .then(function(response){
        $scope.departments = response;
      });
    }
    $scope.loadTagsDepartment = function(query) {
      return $scope.departments.filter(function(tag) {
        return tag.department.toLowerCase().indexOf(query.toLowerCase()) != -1;
      });
    };

    function getJob()
    {
      restFulService.get('job')
      .then(function(response){
        $scope.jobs = response;
      });
    }
    $scope.loadTagsJob = function(query) {
      return $scope.jobs.filter(function(tag) {
        return tag.job.toLowerCase().indexOf(query.toLowerCase()) != -1;
      });
    };

    function getUser()
    {
      restFulService.get('user/findWithProfile')
      .then(function(response){
        $scope.users = response;
      });
    }
    $scope.loadTagsUser = function(query) {
      return $scope.users.filter(function(tag) {
        return tag.username.toLowerCase().indexOf(query.toLowerCase()) != -1;
      });
    };

    function setAuthorizations(json) {
      var obj = {};
      $scope.modules.forEach(function(v, k) {
        for (var key in json) {
          if (v.title == key) {
            v.access = json[key].a;
            obj = json[key];
            break;
          } else {
            v.access = false;
          }
        }
        if (v.sections !== undefined) {
          v.sections.forEach(function(va, ke) {
            for (var index in obj) {
              if (va.title == index) {
                va.access = obj[index].a;
                va.write = obj[index].w;
                break;
              } else {
                va.access = false;
                va.write = false;
              }
            }
          });
        }
      });
    }

    function getAuthorizations()
    {
      var authorizations = {};
      $scope.modules.forEach(function(v, k) {
        if (v.access === undefined) {
          v.access = false;
        }
        authorizations[v.title] = {access: v.access};
        if (v.sections !== undefined) {
          v.sections.forEach(function(va, ke){
            if (va.access === undefined) {
              va.access = false;
            }
            if (va.write === undefined) {
              va.write = false;
            }
            authorizations[v.title][va.title] = {access: va.access, write: va.write};
          });
        }
      });
      return authorizations;
    }

    /**
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    * Watch
    * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    $scope.$watchCollection('tags.department', function(n,o){
      if (n) {
        var x = [];
        n.forEach(function(va,ke){
          $scope.users.forEach(function(v,k){
            if (v.profile.department !== '') {
              if (v.profile.department == va.department) {
                x.push(v);
              }
            }
          });
        });
        $scope.tags.user = x;
      }
    });

    $scope.$watchCollection('tags.job', function(n,o){
      if (n) {
        var x = [];
        n.forEach(function(va,ke){
          $scope.users.forEach(function(v,k){
            if (v.profile.job !== '') {
              if (v.profile.job == va.job) {
                x.push(v);
              }
            }
          });
        });
        $scope.tags.user = x;
      }
    });

    $scope.$watchCollection('tags.user', function(n,o){
      if (n) {
        if (n.length > 0) {
          lastUser = n.length-1;
          setAuthorizations(n[lastUser].authorizations);
        }
        $('#formRole').smkClear();
        $scope.select.role = {};
      }
    });

    $scope.$watch('select.role', function(n,o){
      if (n) {
        if (n.authorizations !== undefined) {
          setAuthorizations(n.authorizations);
        } else {
          if ($scope.tags.user.length > 0 && lastUser !== null) {
            setAuthorizations($scope.tags.user[lastUser].authorizations);
          }
        }
      }
    });

  }]);

})();
