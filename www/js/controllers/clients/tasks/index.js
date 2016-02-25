(function() {
  'use strict';

  angular
    .module('cif')
    .controller('TaskIndexCtrl', TaskIndexCtrl)

  TaskIndexCtrl.$inject = ['Client', '$stateParams', 'Case', 'AssessmentDomain', 'Task', '$rootScope', '$state'];

  function TaskIndexCtrl(Client, $stateParams, Case, AssessmentDomain, Task, $rootScope, $state) {
    var clientId = $stateParams.clientId,
        vm       = this;

    vm.case              = {};
    vm.client            = {};
    vm.title             = 'Active Tasks';
    vm.assessment        = {};
    vm.assessmentDomains = [];
    vm.tasks             = [];
    vm.upcomingDues      = [];
    vm.overdueTasks      = [];
    vm.onDues            = [];
    vm.goBack            = _goBack;

    _init();

    function _init() {
      $rootScope.$broadcast('loading:show');
      _initClient();
    }

    function _initClient() {
      var date = new Date().toDateString();
      Client.filterById(clientId).then(function(response) {
        vm.client = response[0];
        vm.case   = vm.client.case;

        Task.overDues(vm.case.tasks).then(function(response) {
          vm.overdueTasks = response;
        })

        Task.onDues(vm.case.tasks).then(function(response) {
          vm.onDues       = response;
        })

        Task.upcomingDues(vm.case.tasks).then(function(response) {
          vm.upcomingDues = response;
        })

        $rootScope.$broadcast('loading:hide');
      })
    }

    function _goBack() {
      $state.go('root.clients.show', {id: clientId});
    }
  }
})()