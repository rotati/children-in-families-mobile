(function() {
  'use strict';

  angular
    .module('cif')
    .directive('assessmentScore', assessmentScore);

  assessmentScore.$inject = ['$compile'];

  function assessmentScore($compile) {
    return {
      restrict: 'A',
      scope: {
        assessmentScore: '@'
      },
      link: function(scope, elem, attrs) {
        switch(scope.assessmentScore) {
          case '1':
            elem[0].className = 'box box-assertive';
            break;
          case '2':
            elem[0].className = 'box box-energized';
            break;
          case '3':
            elem[0].className = 'box box-positive';
            break;
          case '4':
            elem[0].className = 'box box-balanced';
            break;
        }
      }
    };
  }
})();