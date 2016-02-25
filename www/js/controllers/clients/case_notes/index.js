(function() {
  'use strict';

  angular
    .module('cif')
    .controller('CaseNoteIndexCtrl', CaseNoteIndexCtrl)

  CaseNoteIndexCtrl.$inject = ['$rootScope', '$stateParams', '$state', '$scope', 'CaseNote', 'DomainGroup', 'Client', 'AssessmentDomain', 'Domain', 'User'];

  function CaseNoteIndexCtrl($rootScope, $stateParams, $state, $scope, CaseNote, DomainGroup, Client, AssessmentDomain, Domain, User) {
    var vm       = this,
        page     = 1,
        clientId = $stateParams.clientId,
        options  = {limit: 1, page: page};

    vm.total                = 0;
    vm.options              = options;
    vm.client               = {};
    vm.clientCase           = {};
    vm.caseNote             = {};
    vm.currentUser          = {};
    vm.tasks                = [];
    vm.domains              = [];
    vm.domainGroups         = [];
    vm.assessmentDomains    = [];
    vm.caseNoteDomainGroups = [];
    vm.nextCaseNote         = _nextCaseNote;
    vm.previousCaseNote     = _previousCaseNote;
    vm.showOngoingTask      = _showOngoingTask;
    vm.goBack               = _goBack;

    _init();

    function _init() {
      $rootScope.$broadcast('loading:show');

      _getCurrentUser();
      _initDomain();
      _initClient();
      _initDomainGroup();
    }

    function _getCurrentUser() {
      User.currentUser().then(function(response) {
        vm.currentUser = response;
      })
    }

    function _initClient() {
      Client.filterById(clientId).then(function(response) {
        vm.client         = response[0];
        vm.options.caseId = vm.client.case.id;

        _totalPage();
      })
    }

    function _initDomainGroup() {
      DomainGroup.all().then(function(response) {
        vm.domainGroups = response;
      }).catch(function(error) {
        console.log(error);
      })
    }

    function _initDomain() {
      Domain.all().then(function(response) {
        vm.domains = response;
      })
    }

    function _initCaseNote() {
      CaseNote.all(vm.options).then(function(response) {
        if(angular.isDefined(response[0])) {
          vm.caseNote = response[0];
          CaseNote.caseNoteDomainGroups(vm.caseNote).then(function(results) {
            vm.caseNoteDomainGroups = results;
          })

          _loadTasks();
          _loadAssessmentDomain();
        }

        $rootScope.$broadcast('loading:hide');
      }).catch(function(error) {
        console.log(error);
      })
    }

    function _loadTasks() {
      CaseNote.tasks(vm.caseNote).then(function(response) {
        vm.tasks = response;
      })
    }

    function _loadAssessmentDomain() {
      var assessmentId = vm.caseNote.assessment.id;

      AssessmentDomain.filterByAssessment(assessmentId).then(function(response) {
        vm.assessmentDomains = response;
      })
    }

    function _totalPage() {
      CaseNote.filterByCase(vm.client.case.id).then(function(response) {
        var total = Math.ceil(response / vm.options.limit);

        if(total <= 0)
          $state.go('root.clients.caseNotes.new', {clientId: clientId});

        vm.total        = total;
        vm.options.page = vm.total;

        _initCaseNote();
      })
    }

    function _previousCaseNote() {
      var options = vm.options;
      if(page <= 1 && options.page != vm.total) {
        vm.options.page = 1;
      } else {
        page = options.page - 1;
        vm.options.page = page;
      }

      _initCaseNote();
    }

    function _nextCaseNote() {
      page = page + 1;

      if(page <= vm.total) {
        vm.options.page = page;

        _initCaseNote();
      }
    }

    function _showOngoingTask(domainGroupId) {
      var show = false;

      angular.forEach(vm.tasks, function(task) {
        if(domainGroupId == task.domain.domainGroup.id) {
          show = true;
          return;
        }
      })

      return show;
    }

    function _goBack() {
      $state.go('root.clients.show', { id: clientId });
    }
  }
})()
