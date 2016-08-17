(function(){
  'use strict';

  angular
  .module('users')
  .directive('roleAuthorizations', roleAuthorizations);

  function roleAuthorizations(){

    return {
      restrict: 'E',
      require: 'ngModel',
      scope: {
        modules: '=',
        type: '@',
        id: '='
      },
      templateUrl: 'app/users/roles/roleAuthorizations.html',
      link: function(scope, elem, attrs, modelCtrl) {

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Methods
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        function getAuthorizations(modules, type, id) {

          modules.forEach(function(v, k) {

            v._access = false;
            v._write = false;

            if (v.authorizations) {
              if (v.authorizations.access) {
                if (v.authorizations.access[type].indexOf(id) >= 0) {
                  v._access = true;
                }
              }
              if (v.authorizations.write) {
                if (v.authorizations.write[type].indexOf(id) >= 0) {
                  v._write = true;
                }
              }
            }

            if (v.children) {
              v.children.forEach(function(va, ke) {

                va._access = false;
                va._write = false;

                if (va.authorizations) {

                  if (va.authorizations.access) {
                    if (va.authorizations.access[type].indexOf(id) >= 0) {
                      va._access = true;
                    }
                  }

                  if (va.authorizations.write) {
                    if (va.authorizations.write[type].indexOf(id) >= 0) {
                      va._write = true;
                    }
                  }

                }

              });
            }

          });

        }

        function setAuthorizations(modules, type, id) {

          var m = angular.copy(modules);

          m.forEach(function(v, k) {

            if (v.authorizations) {

              if (v.authorizations.access) {
                var keyA = v.authorizations.access[type].indexOf(id);
                if (v._access) {
                  if (keyA < 0) {
                    v.authorizations.access[type].push(id);
                  }
                } else {
                  if (keyA >= 0) {
                    v.authorizations.access[type].splice(keyA, 1);
                  }
                }
              }

              if (v.authorizations.write) {
                var keyW = v.authorizations.write[type].indexOf(id);
                if (v._write) {
                  if (keyW < 0) {
                    v.authorizations.write[type].push(id);
                  }
                } else {
                  if (keyW >= 0) {
                    v.authorizations.write[type].splice(keyW, 1);
                  }
                }
              }

            }

            if (v.children) {
              v.children.forEach(function(va, ke) {

                if (va.authorizations) {

                  if (va.authorizations.access) {

                    var indexA = va.authorizations.access[type].indexOf(id);

                    if (va._access) {
                      if (indexA < 0) {
                        va.authorizations.access[type].push(id);
                      }
                    } else {
                      if (indexA >= 0) {
                        va.authorizations.access[type].splice(indexA, 1);
                      }
                    }
                    delete va._access;

                  }

                  if (va.authorizations.write) {

                    var indexW = va.authorizations.write[type].indexOf(id);

                    if (va._write) {
                      if(indexW < 0) {
                        va.authorizations.write[type].push(id);
                      }
                    } else {
                      if (indexW >= 0) {
                        va.authorizations.write[type].splice(indexW, 1);
                      }
                    }
                    delete va._write;

                  }

                }

              });
            }

          });

          return m;
        }

        /**
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        * Watch
        * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        */
        scope.$watch('id', function(nv, ov) {
          if (scope.type && nv) {
            getAuthorizations(scope.modules, scope.type, nv);
          }
        });

        scope.$watch('modules', function(nv, ov) {
          if (nv.length > 0 && scope.type && scope.id) {
            modelCtrl.$setViewValue(setAuthorizations(nv, scope.type, scope.id));
          }
        }, true);

      }

    };

  }

})();
