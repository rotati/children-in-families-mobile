(function() {
  'use strict';

  angular
    .module('cif')
    .factory('Case', Case)

  Case.$inject = ['$q'];

  function Case($q) {
    var Case = null;

        Case = persistence.define('Case', {
          currentAddress: 'TEXT',
          caseType: 'TEXT',
          userId: 'INTEGER',
          clientId: 'INTEGER',
          createdAt: 'DATE',
          updatedAt: 'DATE',
        });

    return{
      init: _init,
      all: _all,
      findBy: _findBy,
      entity: Case,
      assessments: _assessments
    }

    function _init() {
      persistence.schemaSync();
    }

    function _all() {
      var defer = $q.defer();

      Case.all().list(null, function(response){
        defer.resolve(response);
      })

      return defer.promise;
    }

    function _findBy(field, value) {
      var defer = $q.defer();

      Case.findBy(field, value, function(result) {
        defer.resolve(result);
      })

      return defer.promise;
    }

    function _assessments(clientCase) {
      var defer = $q.defer();

      clientCase.assessments.order('createdAt', false).list(function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }
  }
})();