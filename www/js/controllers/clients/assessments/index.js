(function() {
  'use strict';

  angular
    .module('cif')
    .controller('AssessmentIndexCtrl', AssessmentIndexCtrl);

  AssessmentIndexCtrl.$inject = ['$stateParams', '$rootScope', '$state', 'Assessment', 'Client'];

  function AssessmentIndexCtrl($stateParams, $rootScope, $state, Assessment, Client) {
    var clientId   = $stateParams.clientId,
        vm         = this;

    vm.clientId       = clientId;
    vm.client         = {};
    vm.case           = {};
    vm.assessments    = [];
    vm.nextAssessment = null;
    vm.goBack         = _goBack;

    _init();

    function _init() {
      $rootScope.$broadcast('loading:show');
      _initClient();
    }

    function _initClient() {
      Client.filterById(clientId).then(function(response) {
        vm.client = response[0];
        vm.case   = vm.client.case;

        _initAssessment();;
      });
    }

    function _initAssessment() {
      Assessment.filterByCase(vm.case.id).then(function(response) {
        var nextAssessment = Assessment.nextAssessment(response);

        vm.assessments     = response;
        vm.nextAssessment  = nextAssessment;

        $rootScope.$broadcast('loading:hide')
      })
    }

    function _goBack() {
      $state.go('root.clients.show', { id: clientId });
    }
  }
})()
