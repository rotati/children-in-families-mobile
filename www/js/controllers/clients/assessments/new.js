(function() {
  'use strict';

  angular
    .module('cif')
    .controller('AssessmentNewCtrl', AssessmentNewCtrl);

  AssessmentNewCtrl.$inject = ['$stateParams', '$state', 'Domain', 'Assessment', 'Client', 'Case', 'AssessmentDomain', '$ionicModal', '$scope', 'AssessmentChangeLog'];

  function AssessmentNewCtrl($stateParams, $state, Domain, Assessment, Client, Case, AssessmentDomain, $ionicModal, $scope, AssessmentChangeLog) {
    var vm       = this,
        clientId = $stateParams.clientId;

    vm.domains             = [];
    vm.newAssessment       = { score: 3};
    vm.currentDomainIndex  = 0;
    vm.lastAssement        = {};
    vm.existingAssessment  = { assessmentDomains: [], date: new Date() };
    vm.lastAssementDomains = [];
    vm.done                = _done;
    vm.finish              = _finish;
    vm.case                = null;
    vm.client              = {};
    vm.goHome              = _goHome;
    vm.goBack              = _goBack;
    vm.closeModal          = _closeModal;


    $ionicModal.fromTemplateUrl('templates/modal/gohome.html', {
      scope: $scope
    }).then(function(modal) {
      vm.goHomeModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal/assessment_back.html', {
      scope: $scope
    }).then(function(modal) {
      vm.goBackModal = modal;
    });


    _init();

    function _init() {
      _initClient();
    }

    function _canCreate() {
      Assessment.canCreate(vm.case.id).then(function(response) {
        if(!response.canCreate) {
        $state.go('root.clients.assessments', { clientId: clientId });
      }
      });
    }

    function _initClient() {
      Client.filterById(clientId).then(function(response) {
        vm.client = response[0];
        vm.case   = vm.client.case;

        _canCreate();

        Case.assessments(vm.case).then(function(results) {
          if(results.length > 0)
            _lastAssementDomain(results[0]);
          else
            _initDomain();
        })
      })
    }

    function _lastAssementDomain(assessment) {
      AssessmentDomain.filterByAssessment(assessment.id).then(function(response) {
        vm.lastAssementDomains = response;

        _initDomain();
      });
    }

    function _initDomain() {
      Domain.all().then(function(response) {
        vm.domains                          = response;
        vm.newAssessment.lastDomain         = false;
        vm.newAssessment.Domain_assessments = vm.domains[vm.currentDomainIndex].id;
        vm.newAssessment.domainName         = vm.domains[vm.currentDomainIndex].name;
        vm.newAssessment.domainIdentity     = vm.domains[vm.currentDomainIndex].identity;
        vm.newAssessment.domainDescription  = vm.domains[vm.currentDomainIndex].description;

        angular.forEach(vm.lastAssementDomains, function(assessmentDomain) {
          if(vm.domains[vm.currentDomainIndex].id == assessmentDomain.Domain_assessments)
            vm.newAssessment.previousScore = assessmentDomain.score;
        })
      }).catch(function(error) {
        console.log(error);
      });
    }

    function _done() {
      vm.existingAssessment.assessmentDomains.push(vm.newAssessment);
      vm.currentDomainIndex              += 1
      vm.newAssessment                    = { score: 3 };
      vm.newAssessment.Domain_assessments = vm.domains[vm.currentDomainIndex].id;
      vm.newAssessment.domainName         = vm.domains[vm.currentDomainIndex].name;
      vm.newAssessment.domainIdentity     = vm.domains[vm.currentDomainIndex].identity;
      vm.newAssessment.domainDescription  = vm.domains[vm.currentDomainIndex].description;

      angular.forEach(vm.lastAssementDomains, function(assessmentDomain) {
        if(vm.domains[vm.currentDomainIndex].id == assessmentDomain.Domain_assessments)
          vm.newAssessment.previousScore = assessmentDomain.score;
      })

      if(vm.domains.length - 1 === vm.currentDomainIndex){
        vm.newAssessment.lastDomain = true;
      } else {
        vm.newAssessment.lastDomain = false;
      }
    }

    function _finish() {
      vm.existingAssessment.assessmentDomains.push(vm.newAssessment);
      vm.existingAssessment.case = vm.case.id;

      _saveLocal();
    }

    function _saveLocal() {
      var data             = vm.existingAssessment;
      var assessment       = new Assessment.entity(data);
      assessment.createdAt = new Date();
      assessment.updatedAt = new Date();

      _saveToServer(assessment);
      Assessment.save(assessment).then(function(response) {
        if(response.isToDoTask) {
          $state.go('root.clients.assessments.tasks.new', {clientId: clientId, id: response.id});
        } else {
          $state.go('root.clients.assessments.show', {clientId: clientId, id: response.id});
        }
      })
    }

    function _saveToChangeLog(localAssessment) {
      AssessmentChangeLog.save(localAssessment).then(function(response) {
        console.log('temp table save');
      })
    }

    function _saveToServer(assessment) {
      var data = {
          assessment: {
            assessment_domains_attributes: []
          }
        }
      angular.forEach(vm.existingAssessment.assessmentDomains, function(assessmentDomain, index) {
        var assessmentDomainObj= {
              domain_id: index + 1,
              score: assessmentDomain.score,
              reason: assessmentDomain.reason
            }
        data.assessment.assessment_domains_attributes.push(assessmentDomainObj)
      })

      Assessment.saveToServer(1, data).then(function(response) {
        console.log(response);
      }).catch(function(error) {
        console.log(error);
        _saveToChangeLog(assessment);
      });
    }

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
