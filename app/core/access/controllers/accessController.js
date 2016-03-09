(function(){
  'use strict';

  angular
  .module('access')
  .controller('AccessCtrl', ['$rootScope', '$scope', 'restFulService', 'config', '$filter', '$translate', function($rootScope, $scope, restFulService, config, $filter, $translate){

    $scope.apiUrl = config.apiUrl;

    $scope.modules = [];

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

      $scope.tags.user.forEach(function(v,k){
        restFulService.put('user/' + v.id, {'authorizations': authorizations})
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


    function setAuthorizations(json, parent) {
      for (var key in json) {
        if (typeof (json[key]) === "object") {
          setAuthorizations(json[key], key);
        } else {
          $scope.modules.forEach(function(v, k) {
            if (v.title === parent) {
              v[key] = json[key];
            }
            if (v.sections !== undefined) {
              v.sections.forEach(function(va, ke){
                if (va.title == parent) {
                  va[key] = json[key];
                }
              });
            }
          });
        }
      }
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
                //setAuthorizations(v.authorizations);
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
                //setAuthorizations(v.authorizations);
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
        n.forEach(function(v,k){
          if(!jQuery.isEmptyObject(v.authorizations)){
            setAuthorizations(v.authorizations);
          }
        });
      }
    });

  }]);

})();
