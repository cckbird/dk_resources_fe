//from https://github.com/angular/angular.js/issues/9826
/*@ngInject*/
module.exports = function ($timeout) {
  return {
    restrict: 'A',
    priority: -1,
    // cause out postLink function to execute before native `ngClick`'s
    // ensuring that we can stop the propagation of the 'click' event
    // before it reaches `ngClick`'s listener
    link: function (scope, elem, attrs) {
      var disabled = false;
      var delay = attrs.clickOnce ? parseInt(attrs.clickOnce, 10) : 500; // min milliseconds between clicks

      function onClick(evt) {
        if (disabled) {
          evt.preventDefault();
          evt.stopImmediatePropagation();
        } else {
          disabled = true;
          $timeout(function () {
            disabled = false;
          }, delay, false);
        }
      }

      scope.$on('$destroy', function () {
        elem.off('click', onClick);
      });
      elem.on('click', onClick);
    }
  };
};
