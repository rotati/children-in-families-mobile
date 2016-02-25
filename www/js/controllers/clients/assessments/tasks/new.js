(function() {
  'use strict';

  angular
    .module('cif')
    .controller('AssessmentTaskNewCtrl', AssessmentTaskNewCtrl)

  AssessmentTaskNewCtrl.$inject = ['Assessment', 'Domain', 'AssessmentDomain', 'Task', 'Client', '$stateParams', '$state', '$rootScope', 'TaskChangeLog'];

  function AssessmentTaskNewCtrl(Assessment, Domain, AssessmentDomain, Task, Client, $stateParams, $state, $rootScope, TaskChangeLog) {
    var vm       = this,
        clientId = $stateParams.clientId,
        id       = $stateParams.id;

    vm.domains            = [];
    vm.case               = {};
    vm.assessmentDomains  = [];
    vm.addTask            = _addTask;
    vm.saveAssessmentTask = _saveAssessmentTask;

    _init();

    function _init() {
      $rootScope.$broadcast('loading:show');

      _initDomain();
      _initClient();
      _initTaskAssessmentDomain();
    }

    function _initDomain() {
      Domain.all().then(function(response) {
        vm.domains = response;
      }).catch(function(error) {
        console.log(error);
      });
    }

    function _initClient() {
      Client.filterById(clientId).then(function(response) {
        vm.case = response[0].case;
      })
    }

    function _initTaskAssessmentDomain() {
      AssessmentDomain.filterByAssessmentAndHasProblem(id).then(function(response) {
        vm.assessmentDomains = response;
        $rootScope.$broadcast('loading:hide');
      })
    }

    function _addTask(tasks) {
      tasks.push({ name: '' });
    }

    function _saveAssessmentTask() {
      angular.forEach(vm.assessmentDomains, function(assessmentDomain) {
        assessmentDomain.taskLists.map(function(task, index) {
          var date      = new Date(),
              nextMonth = date.setMonth(date.getMonth() + 1);

          var data = {
            name: task.name,
            createdAt: date,
            updatedAt: date,
            completionDate: nextMonth,
            completed: false,
            domain: assessmentDomain.Domain_assessments
          }

          var task = new Task.entity(data)

          vm.case.tasks.add(task);
          _saveLocal(task);
          _saveToChangeLog(task);
        })
      })
    }

    function _saveLocal(task) {
      Task.save(task).then(function(response) {
        $state.go('root.clients.assessments.show', { clientId: clientId, id: id });
      })
    }

    function _saveToChangeLog(oldTask) {
      var data = oldTask._data;
      var id   = oldTask.id;
      var task = new TaskChangeLog.entity(data);
      task.taskId = id;

      TaskChangeLog.save(task).then(function(response) {
        console.log(response);
      })
    }
  }
})();