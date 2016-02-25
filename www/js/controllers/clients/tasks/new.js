(function() {
  'use strict';

  angular
    .module('cif')
    .controller('TaskNewCtrl', TaskNewCtrl);

  TaskNewCtrl.$inject = ['Client', '$stateParams', '$state', 'Domain', 'Task', '$rootScope', '$ionicModal', '$scope'];

  function TaskNewCtrl(Client, $stateParams, $state, Domain, Task, $rootScope, $ionicModal, $scope) {
    var vm        = this,
        clientId  = $stateParams.clientId,
        date      = new Date(),
        nextMonth = new Date(date.setMonth(1));

    vm.title      = 'New Task Creator';
    vm.client     = {};
    vm.case       = {};
    vm.task       = { completionDate: nextMonth };
    vm.domains    = [];
    vm.save       = _save;
    vm.goHome     = _goHome;
    vm.goBack     = _goBack;
    vm.closeModal = _closeModal;

    _init();

    function _init() {
      _initDomain();
      _initClient();
    }

    function _initDomain() {
      Domain.all().then(function(response) {
        vm.domains = response;
        vm.task.domain = response[0].id;
      })
    }

    function _initClient() {
      Client.entity.all().filter('id', '=', clientId).prefetch('case').list(null, function(response) {
        vm.client      = response[0];
        vm.case        = vm.client.case;
        vm.task.case   = vm.case;
        vm.task.client = vm.client.name;
      })
    }

    function _save() {
      var task = new Task.entity(vm.task);
      task.createdAt      = new Date();
      task.updatedAt      = new Date();
      task.completed      = false;
      task.completionDate = new Date(vm.task.completionDate).toDateString();

      Task.save(task).then(function(response) {
        vm.task = {};
        vm.task.domain = vm.domains[0].id;
        $state.go('root.clients.tasks', { clientId: clientId });
      })
    }

    $ionicModal.fromTemplateUrl('templates/modal/gohome.html', {
      scope: $scope
    }).then(function(modal) {
      vm.goHomeModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal/task_back.html', {
      scope: $scope
    }).then(function(modal) {
      vm.goBackModal = modal;
    });

    function _goHome() {
      vm.goHomeModal.show();
    }

    function _goBack() {
      vm.goBackModal.show();
    }

    function _closeModal() {
      vm.goHomeModal.hide();
      vm.goBackModal.hide();
    }

    $scope.$on('$destroy', function() {
      vm.goHomeModal.remove();
      vm.goBackModal.remove();
    });
  }
})()