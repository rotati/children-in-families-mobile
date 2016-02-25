(function() {
  'use strict';

  angular
    .module('cif')
    .factory('AssessmentDomain', AssessmentDomain)

  AssessmentDomain.$inject = ['$q'];

  function AssessmentDomain($q) {
    var AssessmentDomain = null;

        AssessmentDomain = persistence.define('Assessment_domains_Domain', {
          score: 'INTEGER',
          reason: 'TEXT',
          previousScore: 'INTEGER',
          Domain_assessments: 'TEXT',
          Assessment_domains: 'TEXT',
          createdAt: 'DATE',
          updatedAt: 'DATE'
        });

    return {
      init: _init,
      all: _all,
      entity: AssessmentDomain,
      save: _save,
      filterByAssessment: _filterByAssessment,
      filterByAssessmentAndHasProblem: _filterByAssessmentAndHasProblem
    };

    function _init() {
      persistence.schemaSync();
    }

    function _all() {
      var defer = $q.defer();

      AssessmentDomain.all().list(null, function(response) {
        defer.resolve(response);
      })
      return defer.promise;
    }

    function _save(data) {
      var defer = $q.defer();

      return defer.promise;
    }

    function _filterByAssessment(id) {
      var defer = $q.defer();

      AssessmentDomain.all().filter('Assessment_domains', '=', id).list(null, function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }

    function _filterByAssessmentAndHasProblem(id) {
      var defer = $q.defer();

      AssessmentDomain.all().filter('Assessment_domains', '=', id).filter('score', '<', 3).list(null, function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }
  }
})();