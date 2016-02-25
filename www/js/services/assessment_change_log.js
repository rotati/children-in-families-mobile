(function() {
  'use strict';

  angular
    .module('cif')
    .factory('AssessmentChangeLog', AssessmentChangeLog)

  AssessmentChangeLog.$inject = ['$q', 'AssessmentDomainChangeLog', '$http', 'API'];

  function AssessmentChangeLog($q, AssessmentDomainChangeLog, $http, API) {
    var Assessment = null;

        Assessment = persistence.define('AssessmentCL', {
          assessmentId: 'TEXT',
          date: 'DATE',
          createdAt: 'DATE',
          updatedAt: 'DATE',
        });

    return {
      init: _init,
      all: _all,
      findBy: _findBy,
      save: _save,
      entity: Assessment
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
      var d = data._data;
      var assessment = new Assessment(d);
      assessment.assessmentId = data.id;

      persistence.add(assessment);

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
  }
})();