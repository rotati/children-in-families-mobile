(function() {
  'use strict';

  angular
    .module('cif')
    .factory('AssessmentDomainChangeLog', AssessmentDomainChangeLog)

  AssessmentDomainChangeLog.$inject = ['$q'];

  function AssessmentDomainChangeLog($q) {
    var AssessmentDomain = null;

        AssessmentDomain = persistence.define('AssessmentCL_domains_Domain', {
          score: 'INTEGER',
          reason: 'TEXT',
          previousScore: 'INTEGER',
          assessmentDomainId: 'TEXT',
          Domain_assessment_change_logs: 'TEXT',
          AssessmentCL_domains: 'TEXT',
          createdAt: 'DATE',
          updatedAt: 'DATE'
        });

    return {
      init: _init,
      all: _all,
      entity: AssessmentDomain,
      save: _save
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
  }
})();