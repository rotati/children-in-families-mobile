
(function() {
  'use strict';
  var ddd = 0;
  angular
    .module('cif')
    .factory('Setup', Setup)

  Setup.$inject = ['DomainGroup', 'Client', 'CaseNote', 'DB', 'CaseNoteDomainGroup', 'Domain', 'Case', 'Assessment', 'AssessmentDomain', 'Task', '$rootScope', 'TaskChangeLog', 'CaseNoteChangeLog', 'AssessmentChangeLog', 'AssessmentDomainChangeLog', 'CaseNoteDomainGroupChangeLog'];

  function Setup(DomainGroup, Client, CaseNote, DB, CaseNoteDomainGroup, Domain, Case, Assessment, AssessmentDomain, Task, $rootScope, TaskChangeLog, CaseNoteChangeLog, AssessmentChangeLog, AssessmentDomainChangeLog, CaseNoteDomainGroupChangeLog) {
    persistence.store.cordovasql.config(persistence, DB.local, '1.1', 'A database description', 40 * 1024 * 1024, 2);

    _init();

    return {
      init: _init
    }

    function _init() {
      DomainGroup.init();
      Client.init();
      CaseNote.init();
      CaseNoteDomainGroup.init();
      Domain.init();
      Case.init();
      Assessment.init();
      AssessmentDomain.init();
      Task.init();

      TaskChangeLog.init();
      CaseNoteChangeLog.init();
      AssessmentChangeLog.init();

      Client.entity.hasOne('case', Case.entity);

      Case.entity.hasMany('caseNotes', CaseNote.entity, 'case');
      Assessment.entity.hasMany('caseNotes', CaseNote.entity, 'assessment');

      CaseNote.entity.hasMany('caseNoteDomainGroups', CaseNoteDomainGroup.entity, 'caseNote');
      DomainGroup.entity.hasMany('caseNoteDomainGroups', CaseNoteDomainGroup.entity, 'domainGroup');

      Case.entity.hasMany('assessments', Assessment.entity, 'case');

      Domain.entity.hasMany('assessments', Assessment.entity, 'domains');

      Assessment.entity.hasMany('domains', Domain.entity, 'assessments');

      DomainGroup.entity.hasMany('domains', Domain.entity, 'domainGroup');

      Domain.entity.hasMany('tasks', Task.entity, 'domain');
      Case.entity.hasMany('tasks', Task.entity, 'case');
      CaseNote.entity.hasMany('tasks', Task.entity, 'caseNote');

      CaseNoteDomainGroup.entity.hasMany('tasks', CaseNoteDomainGroup.entity, 'caseNoteDomainGroup');

      // Change log table

      AssessmentChangeLog.entity.hasMany('domains', Domain.entity, 'assessmentChangeLogs');
      Domain.entity.hasMany('assessmentChangeLogs', AssessmentChangeLog.entity, 'domains');
      Case.entity.hasMany('assessmentChangeLogs', AssessmentChangeLog.entity, 'case');

      Domain.entity.hasMany('taskCls', TaskChangeLog.entity, 'domain');
      Case.entity.hasMany('taskCls', TaskChangeLog.entity, 'case');
      CaseNote.entity.hasMany('taskCls', TaskChangeLog.entity, 'caseNote');

      AssessmentChangeLog.entity.hasMany('caseNoteChangeLogs', CaseNoteChangeLog.entity, 'assessmentChangeLog');
      CaseNoteDomainGroupChangeLog.entity.hasMany('taskChangeLogs', CaseNoteDomainGroupChangeLog.entity, 'caseNoteDomainGroupChangeLog');
      CaseNoteChangeLog.entity.hasMany('caseNoteDomainGroupChangeLogs', CaseNoteDomainGroupChangeLog.entity, 'caseNoteChangeLog');
      DomainGroup.entity.hasMany('caseNoteDomainGroupChangeLogs', CaseNoteDomainGroupChangeLog.entity, 'domainGroup');
      Case.entity.hasMany('caseNoteChangeLogs', CaseNoteChangeLog.entity, 'case');
      CaseNoteChangeLog.entity.hasMany('taskChangeLogs', TaskChangeLog.entity, 'caseNoteChangeLog');

      _loadSampleData();

      $rootScope.$broadcast('loading:hide');
    }

    function _loadSampleData() {
      DomainGroup.entity.all().count(null, function(response) {
        if(response == 0)
          _loadDomainGroup();
      })

      Client.entity.all().count(null, function(response) {
        if(response == 0)
          _loadClient();
      })
    }

    function _loadDomain(domainGroup) {
      var domainsA = [{ '1a': 'Food and Security' },{ '2a': 'Shelter' },{ '3a': 'Protection from Abuse and Exploitation Legal Protection' }, { '4a': 'Wellness' }, { '5a': 'Emotional Health' }, { '6a': 'Performance' }],
          domainsB = [{ '1b': 'Nutrition and Growth'}, { '2b': 'Care' }, { '3b': 'Legal Protection' }, { '4b': 'Health Care Services' }, { '5b': 'Social Behaviour' }, { '6b': 'Work and Education' }],
          i        = domainGroup.name;
      var identityA = i + 'A';
      var identityB = i + 'B';

      var domainA = new Domain.entity({
        identity: identityA,
        name: domainsA[i -1][identityA.toLowerCase()],
        description: faker.lorem.paragraphs(),
        domainGroup: domainGroup,
        createdAt: new Date(),
        updatedAt: new Date
      })

      var domainB = new Domain.entity({
        identity: identityB,
        name: domainsB[i - 1][identityB.toLowerCase()],
        description: faker.lorem.paragraphs(),
        domainGroup: domainGroup,
        createdAt: new Date(),
        updatedAt: new Date
      })

      persistence.add(domainA);
      persistence.add(domainB);

      persistence.flush();
    }

    function _loadClient() {
      for(var i=0; i<=5; i++) {
        var client = new Client.entity({
          name: faker.name.findName(),
          gender: 'Male',
          caseWorkerId: 1,
          dateOfBirth: new Date(),
          caseWorkerName: 'Bunhouth',
          birthProvince: 'Kampong Thum',
          status: 'foster care',
          clientId: i,
          createdAt: new Date(),
          updatedAt: new Date()
        })

        persistence.add(client);
        _loadCase(client);

        persistence.flush(function(){
          console.log('Save');
        });
      }
    }

    function _loadDomainGroup() {
      for(var i = 1; i<=6; i++) {
        var domainGroup = new DomainGroup.entity({
          name: ''+i,
          description: 'Domain description' + i
        })

        persistence.add(domainGroup);
        _loadDomain(domainGroup);

        persistence.flush();
      }
    }

    function _loadCase(client) {
      var clientCase = new Case.entity({
        currentAddress: faker.address.city() + ' ' +faker.address.streetAddress(),
        caseType: 'kinship case',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      client.case = clientCase;
      // _loadAssessment(clientCase);
      persistence.add(clientCase);
      persistence.flush();
    }

    function _loadAssessment(clientCase) {
      var assessment = new Assessment.entity({
        createdAt: new Date(),
        updatedAt: new Date(),
        date: new Date()
      })

      persistence.add(assessment);
      clientCase.assessments.add(assessment);
      _loadAssessmentDomains(assessment);
      persistence.flush();
      _loadAssessmentCL(assessment);
    }

    function _loadAssessmentCL(oldAssessment) {
      var assessment = new AssessmentChangeLog.entity;
      assessment.assessmentId = oldAssessment.id;
      assessment.date = oldAssessment._data.date;
      assessment.createdAt = oldAssessment._data.createdAt;
      assessment.updatedAt = oldAssessment._data.updatedAt;
      assessment.case = oldAssessment._data.case;

      persistence.add(assessment);
      persistence.flush();
    }

    function _loadAssessmentDomains(assessment) {
      for(var i=1; i <=6;i++) {
        var identityA = i + 'A';
        var identityB = i + 'B';

        Domain.findBy('identity', identityA).then(function(response) {
          var data = {
            score: Math.floor(Math.random() * 4) + 1 ,
            reason: faker.lorem.sentences(),
            createdAt: new Date(),
            updatedAt: new Date(),
            Domain_assessments: response.id,
            Assessment_domains: assessment
          }

          var assessmentDomain = new AssessmentDomain.entity(data);
          persistence.add(assessmentDomain);

          var assessmentDomainCL = new AssessmentDomainChangeLog.entity(data);
          assessmentDomainCL.assessmentDomainId = assessmentDomain.id;
          assessmentDomainCL.Domain_assessment_change_logs = response.id;
          assessmentDomainCL.AssessmentCL_domains = assessment;

          persistence.add(assessmentDomainCL);
          persistence.flush();
        })

        Domain.findBy('identity', identityB).then(function(response) {
          var data = {
            score: Math.floor(Math.random() * 4) + 1 ,
            reason: faker.lorem.sentences(),
            createdAt: new Date(),
            updatedAt: new Date(),
            Domain_assessments: response.id,
            Assessment_domains: assessment
          }

          var assessmentDomain = new AssessmentDomain.entity(data);
          persistence.add(assessmentDomain);

          var assessmentDomainCL = new AssessmentDomainChangeLog.entity(data);
          assessmentDomainCL.assessmentDomainId = assessmentDomain.id;
          assessmentDomainCL.Domain_assessment_change_logs = response.id;
          assessmentDomainCL.AssessmentCL_domains = assessment;

          persistence.add(assessmentDomainCL);
          persistence.flush();
        })

        persistence.flush();
      }
    }
  }
})();