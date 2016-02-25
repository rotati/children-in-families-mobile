(function() {
  'use strict';

  angular
    .module('cif')
    .controller('CaseNoteNewCtrl', CaseNoteNewCtrl);

  CaseNoteNewCtrl.$inject = ['$scope' ,'$stateParams', '$state', '$rootScope', 'CaseNote', 'DomainGroup', 'Client', 'User', 'AssessmentDomain', 'Domain', 'Task', '$ionicModal', 'CaseNoteChangeLog', 'TaskChangeLog'];

  function CaseNoteNewCtrl($scope ,$stateParams, $state, $rootScope, CaseNote, DomainGroup, Client, User, AssessmentDomain, Domain, Task, $ionicModal, CaseNoteChangeLog, TaskChangeLog) {
    var vm        = this,
        clientId  = $stateParams.clientId,
        date      = new Date(),
        nextMonth = new Date(date.setMonth(1));

    vm.title               = 'New Case Note';
    vm.client              = {};
    vm.case                = {};
    vm.domains             = [];
    vm.domainGroups        = [];
    vm.currentUser         = {} ;
    vm.caseNote            = { noteDomainGroups: [], attendee: '', meetingDate: nextMonth };
    vm.assessment          = {};
    vm.assessmentChangeLog = {}
    vm.save                = _save;
    vm.assessmentDomains   = [];
    vm.incompleteTasks     = [];
    vm.showOngoingTask     = _showOngoingTask;
    vm.goHome              = _goHome;
    vm.goBack              = _goBack;
    vm.closeModal          = _closeModal;

    _init();

    function _init() {
      $rootScope.$broadcast('loading:show');

      _getCurrentUser();
      _initClient();
      _initDomain();
      _initDomainGroup();

    }

    function _getCurrentUser() {
      User.currentUser().then(function(response) {
        vm.currentUser = response;
      })
    }

    function _save() {
      _saveLocal();
    }

    function _saveLocal() {
      var data     = vm.caseNote,
          date     = new Date(),
          caseNote = new CaseNote.entity(data);

      caseNote.createdAt = date;
      caseNote.updatedAt = date;

      vm.assessment.caseNotes.add(caseNote);
      _updateTask(caseNote);

      CaseNote.save(caseNote).then(function(response) {
        $state.go('root.clients.caseNotes', {clientId: clientId});
      })
    }

    function _saveToChangeLog(caseNote) {
      var data          = caseNote._data;
      data.caseNoteId   = caseNote.id;
      var caseNoteCL    = new CaseNoteChangeLog.entity(data);
      caseNoteCL.id     = caseNote.id;

      vm.assessmentChangeLog.caseNoteChangeLogs.add(caseNoteCL);

      _updateTaskChangeLog(caseNoteCL);
      persistence.add(caseNoteCL);
      persistence.flush();
    }

    function _saveToServer(caseNote) {
      var data = {
        case_note: {
          meeting_date: caseNote._data.meetingDate,
          attendee: caseNote._data.attendee,
          case_note_domain_groups_attributes: []
        }
      }
      angular.forEach(caseNote.noteDomainGroups, function(noteDomainGroup, index) {
        var caseNoteDomainGroupObj = {
          note: noteDomainGroup.note,
          domain_group_id: index + 1,
          task_ids: []
        }
      });
    }

    function _updateTask(caseNote) {
      angular.forEach(vm.incompleteTasks, function(incompleteTask, index) {
        if(JSON.parse(incompleteTask.completed)) {
          Task.markTaskAsComplete(incompleteTask, caseNote).then(function(response) {
            console.log(response);
          })
        }
      })
    }

    function _updateTaskChangeLog(caseNote) {
      angular.forEach(vm.incompleteTasks, function(incompleteTask, index) {
        if(JSON.parse(incompleteTask.completed)) {
          TaskChangeLog.findBy('taskId', incompleteTask.id).then(function(response) {
            var incompleteTaskCL = response[0];
            incompleteTaskCL.completed = incompleteTask.completed;

            console.log(caseNote);
            TaskChangeLog.markTaskAsComplete(incompleteTaskCL, caseNote).then(function(response) {
              console.log(response);
            })
          })
        }
      })
    }

    function _initDomainGroup() {
      DomainGroup.all().then(function(response) {
        vm.domainGroups         = response;

        angular.forEach(response, function(domain) {
          vm.caseNote.noteDomainGroups.push({
            domainGroup: domain.id,
            note: ''
          });
        })
      }).catch(function(error) {
        console.log(error);
      })
    }

    function _initClient() {
      Client.filterById(clientId).then(function(response) {
        vm.client        = response[0];
        vm.clientCase    = vm.client.case;
        vm.caseNote.case = vm.clientCase.id;
        vm.case          = vm.client.case;

        _initAssessment();
        _initAssessmentChangeLog();
        _initIncompleteTask();
      })
    }

    function _initAssessment() {
      vm.clientCase.assessments.order('createdAt', false).list(function(results) {
        vm.assessment = results[0];
        _loadAssessmentDomain();
      })
    }

    function _initAssessmentChangeLog() {
      vm.clientCase.assessmentChangeLogs.order('createdAt', false).list(function(results) {
        vm.assessmentChangeLog = results[0];
      })
    }

    function _loadAssessmentDomain() {
      if(angular.isUndefined(vm.assessment)) {
        $state.go('root.clients.assessments', {clientId: clientId});
      }

      var assessmentId = vm.assessment.id;

      AssessmentDomain.filterByAssessment(assessmentId).then(function(response) {
        vm.assessmentDomains = response;

        $rootScope.$broadcast('loading:hide');
      })
    }

    function _initDomain() {
      Domain.all().then(function(response) {
        vm.domains = response;
      })
    }

    function _initIncompleteTask() {
      Task.entity.all().filter('case', '=', vm.case.id).filter('completed', '=', 'false').list(null, function(response) {
        vm.incompleteTasks = response;
      })
    }

    function _showOngoingTask(domainGroupId) {
      var show = false;
      angular.forEach(vm.incompleteTasks, function(task) {
        if(domainGroupId == task.domain.domainGroup.id) {
          show = true;
          return;
        }
      })

      return show;
    }

    $ionicModal.fromTemplateUrl('templates/modal/gohome.html', {
      scope: $scope
    }).then(function(modal) {
      vm.goHomeModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal/case_note_back.html', {
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
