//combine ngIf and ngShow,if these elements had been compiled,will be keeped in dom
/*@ngInject*/
module.exports = function($animate) {
  return {
    multiElement: true,
    transclude: 'element',
    priority: 600,
    terminal: true,
    restrict: 'A',
    $$tlb: true,
    link: function($scope, $element, $attr, ctrl, $transclude) {
      var childScope;
      $scope.$watch($attr.showIf, function(value) {
        if (value) {
          if (!childScope) {
            $transclude(function(clone, newScope) {
              childScope = newScope;
              clone[clone.length++] = document.createComment(' end showIf: ' + $attr.showIf + ' ');
              $animate.enter(clone, $element.parent(), $element);
            });
          } else {
            $animate['removeClass']($element.next(), 'ng-hide', {
              tempClasses: 'ng-hide-animate'
            });
          }
        } else {
          if (childScope) {
            $animate['addClass']($element.next(), 'ng-hide', {
              tempClasses: 'ng-hide-animate'
            });
          }
        }
      });
    }
  };
}
