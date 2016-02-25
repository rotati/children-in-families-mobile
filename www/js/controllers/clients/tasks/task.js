(function() {
  'use strict';

  angular
    .module('cif')
    .controller('TaskCtrl', TaskCtrl);

  TaskCtrl.$inject = [];

  function TaskCtrl() {
    var vm = this;

    vm.addMoreTask = function(noteTask) {
      var task = {
        name: '',
        completed: false
      }
      noteTask.tasks.push(task);
    }

    vm.removeTask = function(noteTask, taskIndex) {
      noteTask.tasks.splice(taskIndex, 1);
    }
  }
})();
