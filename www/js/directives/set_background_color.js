(function() {
  'use strict';

  angular
    .module('cif')
    .directive('setBackgroundColor', setBackgroundColor);

  setBackgroundColor.$inject = [];

  function setBackgroundColor() {
    return {
      restrict: 'A',
      scope: {
        setBackgroundColor: '@'
      },
      link: function(scope, elem, attrs) {
        switch(scope.setBackgroundColor) {
          case '1':
            elem[0].className = 'row box-border-assertive';
            break;
          case '2':
            elem[0].className = 'row box-border-energized';
            break;
        }
      }
    };
  }
})();