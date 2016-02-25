(function() {
  'use strict';

  angular
    .module('cif')
    .factory('Assessment', Assessment)

  Assessment.$inject = ['$q', 'AssessmentDomain', 'AssessmentDomainChangeLog'];

  function Assessment($q, AssessmentDomain, AssessmentDomainChangeLog) {
    var Assessment = null;

        Assessment = persistence.define('Assessment', {
          caseId: 'INTEGER',
          date: 'DATE',
          createdAt: 'DATE',
          updatedAt: 'DATE',
        });

    return {
      init: _init,
      all: _all,
      findBy: _findBy,
      save: _save,
      entity: Assessment,
      filterByCase: _filterByCase,
      tasks: _tasks,
      caseNotes: _caseNotes,
      nextAssessment: _nextAssessment,
      canCreate: _canCreate,
      assessmentDueDate: _assessmentDueDate,
      saveToServer: _saveToServer
    };

    function _init() {
      persistence.schemaSync();
    }

    function _all() {
      var defer = $q.defer();

      Assessment.all().list(null, function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }

    function _findBy(field, value) {
      var defer = $q.defer();

      Assessment.findBy(field, value, function(result) {
        defer.resolve(result);
      })

      return defer.promise;
    }

    function _save(data) {
      var defer      = $q.defer();
      var isToDoTask = false;

      persistence.add(data);

      angular.forEach(data.assessmentDomains, function(assessmentDomain) {
        var aDomainData = {
          createdAt: new Date(),
          updatedAt: new Date(),
          previousScore: assessmentDomain.previousScore
        }

        var aDomain = new AssessmentDomain.entity(angular.extend(aDomainData, assessmentDomain));
        aDomain.Assessment_domains = data;

        if(aDomain.score < 3) {
          isToDoTask = true;
        }

        var aDomainCL = new AssessmentDomainChangeLog.entity(angular.extend(aDomainData, assessmentDomain));
        aDomainCL.AssessmentCL_domains = data;
        aDomainCL.Domain_assessment_change_logs = assessmentDomain.Domain_assessments;
        aDomainCL.assessmentDomainId = aDomain.id;

        persistence.add(aDomain);
        persistence.add(aDomainCL);
      })

      persistence.flush(function() {
        data = {status: 200, isToDoTask: isToDoTask, id: data.id};
        defer.resolve(data);
      });

      return defer.promise;
    }

    function _setPreviousScore(aDomain, caseId) {
      Assessment.all().filter('case', '=', caseId).order('createdAt', 'desc').list(null, function(response) {
        AssessmentDomain.entity.findBy('Assessment_domains', response[0].id).then(function(response) {
          console.log(response);
        })
      });
    }

    function _filterByCase(id) {
      var defer = $q.defer();

      Assessment.all().filter('case', '=', id).list(null, function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }

    function _tasks(assessment) {

      assessment.caseNotes.order('createdAt', false).list(function(response) {
        angular.forEach(response, function(result) {
          result.tasks.list(function(tasks) {
            assessmentTasks.push(tasks);
          })
        })

      })
    }

    function _caseNotes(assessment) {
      var defer = $q.defer();

      assessment.caseNotes.order('createdAt', false).list(function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }

    function _nextAssessment(assessments) {
      var nextAssessment = { date: new Date(), canCreate: true };

      if(assessments.length > 0) {
        var lastAssessmentDate = assessments[assessments.length -1].date,
            date               = new Date(lastAssessmentDate);
            date.setMonth(date.getMonth() + 6);

            if(new Date() <= date) {
              nextAssessment = { date: date, canCreate: true };
            } else {
              nextAssessment = { date: date, canCreate: true };
            }
      }
      return nextAssessment;
    }

    function _canCreate(caseId) {
      var defer = $q.defer();

      _filterByCase(caseId).then(function(response) {
        var nextAssessment = _nextAssessment(response)
        defer.resolve(nextAssessment);
      })

      return defer.promise;
    }

    function _assessmentDueDate(caseId) {
      var defer = $q.defer();

      _filterByCase(caseId).then(function(response) {
        var assessment = { mostRecent: new Date(), nextAssessment: new Date(), timeUnit: '1 Day past' };

        if(response.length > 0) {
          var lastAssessmentDate = response[response.length -1].date,
              date               = new Date(lastAssessmentDate);
              date.setMonth(date.getMonth() + 6);

          var assessment = { mostRecent: response[0].date, nextAssessment: date, timeUnit: '1 Day past' };
        }

        defer.resolve(assessment);
      })

      return defer.promise;
    }

    function _saveToServer(caseId, data) {
      var defer = $q.defer();
      var req = {
            method: 'POST',
            url: API.host + '/cases/'+ caseId +'/assessments',
            data: data
          }

      $http(req).success(function(response){
        defer.resolve(response);
      }).error(function(error) {
        defer.reject(error);
      })

      return defer.promise;
    }
  }
})();