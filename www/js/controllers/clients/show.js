(function(){
  'use strict';

  angular
    .module('cif')
    .controller('ClientShowCtrl', ClientShowCtrl);

  ClientShowCtrl.$inject = ['Case', 'Client', 'AssessmentDomain', 'Assessment', 'Domain', '$rootScope', '$stateParams', '$state', '$timeout'];

  function ClientShowCtrl(Case, Client, AssessmentDomain, Assessment, Domain, $rootScope, $stateParams, $state, $timeout) {
    var clientId = $stateParams.id,
        vm       = this;

    vm.title             = 'Show Client';
    vm.client            = {};
    vm.currentDate       = new Date();
    vm.domains           = [];
    vm.assessmentDomains = [];
    vm.goBack            = _goBack;
    vm.assessmentDueDate = {};

    init();

    function init() {
      $rootScope.$broadcast('loading:show');

      _initDomain();
      _initClient();
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
        vm.client = response[0];

        vm.client.case.assessments.order('createdAt', false).list(null, function(results) {
          if(results.length == 0) {
            $state.go('root.clients.assessments', {clientId: clientId});
          } else {
            _initAssessmentDomain(results[0].id)
          }
        })

        _initAssessmentDate();
      })
    }

    function _initAssessmentDomain(assessmentId) {
      AssessmentDomain.filterByAssessment(assessmentId).then(function(response) {
        vm.assessmentDomains = response;

        $rootScope.$broadcast('loading:hide');
      })
    }

    function _goBack() {
      $state.go('root.clients');
    }

    function _initAssessmentDate() {
      Assessment.assessmentDueDate(vm.client.case.id).then(function(response) {
        vm.assessmentDueDate = response;
      })
    }
  }
})()
