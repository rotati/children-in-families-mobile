(function() {
  'use strict';

  angular
    .module('cif')
    .controller('ActiveTaskCtrl', ActiveTaskCtrl);

  ActiveTaskCtrl.$inject = ['$stateParams', '$state', 'Client', 'Case', 'Task'];

  function ActiveTaskCtrl($stateParams, $state, Client, Case, Task) {
    var vm             = this,
        clientId       = $stateParams.id,
        paginateOption = {limit: 25, page: 0},
        date           = new Date().toDateString();

    vm.title            = 'Active Task List';
    vm.search           = {};
    vm.clients          = [];
    vm.clientId         = clientId;
    vm.onDuesCase       = [];
    vm.onDuesTask       = [];
    vm.overduesTask     = [];
    vm.overduesCase     = [];
    vm.upcomingDuesCase = [];
    vm.upcomingDuesTask = [];
    vm.changeFilter     = _changeFilter;
    vm.goBack           = _goBack;

    _init();

    function _init() {
      _initOndueTask();
      _initOverdueTasks();
      _initUpcomingTask();
    }

    function _initOndueTask() {
      Task.onDuesTask().then(function(response) {
        vm.onDuesTask = response;

        angular.forEach(response, function(result) {
          var clientCase       = result.case;

          Client.filterByCase(clientCase.id).then(function(res) {
            clientCase._data.client = res[0];
            clientCase              = angular.toJson(clientCase, true);

            vm.onDuesCase.push(JSON.parse(clientCase));
            vm.clients.push(res[0]);
          })
        })
      })
    }

    function _initOverdueTasks() {
      Task.overduesTask().then(function(response) {
        vm.overduesTask = response;

        angular.forEach(response, function(result) {
          var clientCase        = result.case;

          Client.filterByCase(clientCase.id).then(function(res) {
            clientCase._data.client = res[0];
            clientCase              = angular.toJson(clientCase, true);
            vm.overduesCase.push(JSON.parse(clientCase));
            vm.clients.push(res[0]);
          })
        })
      })
    }

    function _initUpcomingTask() {
      Task.upcoming().then(function(response) {
        vm.upcomingDuesTask = response;

        angular.forEach(response, function(result) {
          var clientCase       = result.case;

          Client.filterByCase(clientCase.id).then(function(res) {
            clientCase._data.client = res[0];
            clientCase              = angular.toJson(clientCase, true);

            vm.upcomingDuesCase.push(JSON.parse(clientCase));
            vm.clients.push(res[0]);
          })
        })
      })
    }

    function _changeFilter() {
      if(vm.search.client.id == null)
        vm.search = {};
    }

    function _goBack() {
      $state.go('root.clients');
    }
  }
})()