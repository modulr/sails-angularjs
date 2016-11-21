(function(){
  'use strict';

  angular
  .module('helpers')
  .directive('checkbox', [function() {
    return {
      scope: true,
      require: '?ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        var childList = attrs.childList;
        var property = attrs.property;
        var checked = attrs.ckecked;
        var unchecked = attrs.unckecked;
        var indeterminate = attrs.indeterminate;
        var i = element.next('i');

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

          if (newValue.length === 0) {
            if (modelCtrl.$modelValue) {
              hasChecked = true;
            } else {
              hasUnchecked = true;
            }
          }

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
            $(i).addClass(indeterminate);
            $(i).removeClass(checked);
            $(i).removeClass(unchecked);
            if (modelCtrl) {
              modelCtrl.$setViewValue(true);
            }
          } else {
            element.prop('indeterminate', false);
            element.prop('checked', hasChecked);
            if (hasChecked) {
              $(i).addClass(unchecked);
              $(i).removeClass(checked);
              $(i).removeClass(indeterminate);
            } else {
              $(i).addClass(checked);
              $(i).removeClass(unchecked);
              $(i).removeClass(indeterminate);
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
