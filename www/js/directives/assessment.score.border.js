(function() {
  'use strict';

  angular
    .module('cif')
    .directive('assessmentScoreBorder', assessmentScoreBorder);

  assessmentScoreBorder.$inject = ['$compile'];

  function assessmentScoreBorder($compile) {
    var score = '<div class="box {{colorClass}}">{{score}}</div>';

    return {
      restrict: 'AE',
      replace: true,
      link: function(scope, elem, attrs) {
        switch(scope.score) {
          case 1:
            elem.addClass('box-border-assertive');
            break;
          case 2:
            elem.addClass('box-border-energized');
            break;
          case 3:
            elem.addClass('box-border-positive');
            break;
          case 4:
            elem.addClass('box-border-balanced');
            break;
        }
      },
      scope: {
        score: '='
      },
    };
  }
})();