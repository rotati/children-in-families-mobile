(function(){
  'use strict';

  angular
    .module('cif')
    .controller('ClientConfirmCtrl', ClientConfirmCtrl);

  ClientConfirmCtrl.$inject = ['Case', 'Client', 'AssessmentDomain', 'Assessment', 'Domain', '$rootScope', '$stateParams', '$state'];

  function ClientConfirmCtrl(Case, Client, AssessmentDomain, Assessment, Domain, $rootScope, $stateParams, $state) {
    var clientId = $stateParams.id,
        vm       = this;

    vm.title             = 'Show Client';
    vm.client            = {};
    vm.currentDate       = new Date();
    vm.domains           = [];
    vm.assessmentDomains = [];
    vm.goBack            = _goBack;

    init();

    function init() {
      $rootScope.$broadcast('loading:show');
      _initClient();
    }

    function _initClient() {
      Client.entity.all().filter('id', '=', clientId).prefetch('case').list(null, function(response) {
        vm.client = response[0];
        $rootScope.$broadcast('loading:hide');
      })
    }

    function _goBack() {
      $state.go('root.clients.assessments', { clientId: clientId });
    }
  }
})()
