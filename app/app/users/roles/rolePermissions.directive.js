(function(){
  'use strict';

  angular
  .module('users')
  .directive('rolePermissions', rolePermissions);

  function rolePermissions(){

    return {
      restrict: 'E',
      require: 'ngModel',
      scope: {
        modules: '=',
        model: '=ngModel'
      },
      templateUrl: 'app/users/roles/rolePermissions.html',
      link: function(scope, elem, attrs, modelCtrl) {

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Methods
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        function setPermissions(modules, permissions) {

          modules.forEach(function(module){

            if (module.title in permissions) {
              module._access = false;
              module._write = false;

              if (permissions[module.title]._access) {
                module._access = true;
              }
              if (permissions[module.title]._write) {
                module._write = true;
              }

              if (module.submodules) {
                module.submodules.forEach(function(submodule) {

                  submodule._access = false;
                  submodule._write = false;

                  if (permissions[module.title][submodule.title]._access) {
                    submodule._access = true;
                  }
                  if (permissions[module.title][submodule.title]._write) {
                    submodule._write = true;
                  }

                });
              }
            }

          });

        }

        function getPermissions(modules, permissions) {

          if (!permissions) {
            permissions = {};
          }

          modules.forEach(function(module) {

            if (!(module.title in permissions)) {
              permissions[module.title] = {};
            }

            permissions[module.title]._access = false;
            permissions[module.title]._write = false;

            if (module._access) {
              permissions[module.title]._access = true;
            }
            if (module._write) {
              permissions[module.title]._write = true;
            }

            if (module.submodules) {
              module.submodules.forEach(function(submodule) {

                if (!(submodule.title in permissions[module.title])) {
                  permissions[module.title][submodule.title] = {};
                }

                permissions[module.title][submodule.title]._access = false;
                permissions[module.title][submodule.title]._write = false;

                if (submodule._access) {
                  permissions[module.title][submodule.title]._access= true;
                }
                if (submodule._write) {
                  permissions[module.title][submodule.title]._write= true;
                }

              });
            }

          });

          return permissions;

        }

        function clearPermissions(modules) {

          modules.forEach(function(module){

            // module._access = null;
            // module._write = null;
            delete module._access;
            delete module._write;

            if (module.submodules) {
              module.submodules.forEach(function(submodule) {

                // submodule._access = null;
                // submodule._write = null;
                delete submodule._access;
                delete submodule._write;

              });
            }

          });

        }

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Watch
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        scope.$watch("model", function(nv) {
          if (nv) {
            setPermissions(scope.modules, nv);
          } else {
            clearPermissions(scope.modules);
          }
        });

        scope.$watch('modules', function(nv) {
          if (nv && nv.length > 0) {
            modelCtrl.$setViewValue(getPermissions(nv, scope.model));
          }
        }, true);

      }

    };

  }

})();
