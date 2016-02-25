(function() {
  'use strict';

  angular
    .module('cif')
    .controller('AssessmentShowCtrl', AssessmentShowCtrl);

  AssessmentShowCtrl.$inject = ['$stateParams', '$state', '$rootScope','Client', 'Assessment', 'Domain', 'AssessmentDomain', 'CaseNote'];

  function AssessmentShowCtrl($stateParams, $state, $rootScope, Client, Assessment, Domain, AssessmentDomain, CaseNote) {
    var vm        = this,
        id        = $stateParams.id,
        clientId  = $stateParams.clientId;

    vm.client            = {};
    vm.domains           = [];
    vm.assessment        = {};
    vm.assessmentDomains = [];
    vm.tasks             = [];
    vm.goBack            = _goBack;

    _init();

    function _init() {
      $rootScope.$broadcast('loading:show');

      _initClient();
      _initDomain();
      _initAssessment();
      _initAssessmentDomain();
    }

    function _initClient() {
      Client.findBy('id', clientId).then(function(response) {
        vm.client = response;
      }).catch(function(error) {
        console.log(error);
      })
    }

    function _initDomain() {
      Domain.all().then(function(response) {
        vm.domains = response;
      }).catch(function(error) {
        console.log(error);
      });
    }

    function _initAssessment() {
      Assessment.findBy('id', id).then(function(response) {
        vm.assessment = response;

        _caseNotes();
      })
    }

    function _caseNotes() {
      Assessment.caseNotes(vm.assessment).then(function(response) {
        angular.forEach(response, function(result) {
          _tasks(result);
        })
      })
    }

    function _tasks(caseNote) {
      CaseNote.tasks(caseNote).then(function(response) {
        angular.forEach(response, function(result) {
          vm.tasks.push(result);
        })
      })
    }

    function _initAssessmentDomain() {
      AssessmentDomain.filterByAssessment(id).then(function(response) {
        vm.assessmentDomains = response;

        $rootScope.$broadcast('loading:hide');
      })
    }

    function _goBack() {
      $state.go('root.clients.assessments', { clientId: clientId });
    }
  }
})()
