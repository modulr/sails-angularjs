(function(){
  'use strict';

  angular
    .module('mdr.helpers')
    .directive('checkbox', [function() {
      return {
        scope: true,
        require: '?ngModel',
        link: function (scope, element, attrs, modelCtrl) {
          var childList = attrs.childList;
          var property = attrs.property;
          var i = element.next('i');
          element.parent('label').addClass('fancy-check');

          // Bind the onChange event to update children
          element.bind('change', function () {
            scope.$apply(function () {
              var isChecked = element.prop('checked');

              // Set each child's selected property to the checkbox's checked property
              angular.forEach(scope.$eval(childList), function (child) {
                child[property] = isChecked;
              });
            });
          });

          // Watch the children for changes
          scope.$watch(childList, function (newValue) {
            var hasChecked = false;
            var hasUnchecked = false;

            // Loop through the children
            angular.forEach(newValue, function (child) {
              if (child[property]) {
                hasChecked = true;
              } else {
                hasUnchecked = true;
              }
            });

            // Determine which state to put the checkbox in
            if (hasChecked && hasUnchecked) {
              element.prop('checked', false);
              element.prop('indeterminate', true);
              $(i).addClass('fa-unlock-alt');
              $(i).removeClass('fa-lock');
              $(i).removeClass('fa-unlock');
              if (modelCtrl) {
                modelCtrl.$setViewValue(false);
              }
            } else {
              element.prop('checked', hasChecked);
              element.prop('indeterminate', false);
              if (hasChecked) {
                $(i).addClass('fa-unlock');
                $(i).removeClass('fa-lock');
                $(i).removeClass('fa-unlock-alt');
              } else {
                $(i).addClass('fa-lock');
                $(i).removeClass('fa-unlock');
                $(i).removeClass('fa-unlock-alt');
              }

              if (modelCtrl) {
                modelCtrl.$setViewValue(hasChecked);
              }
            }
          }, true);
        }
      };
    }]);
})();
