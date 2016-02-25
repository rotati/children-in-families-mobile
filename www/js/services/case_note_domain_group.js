(function() {
  'use strict';

  angular
    .module('cif')
    .factory('CaseNoteDomainGroup', CaseNoteDomainGroup)

  CaseNoteDomainGroup.$inject = ['$q', '$http'];

  function CaseNoteDomainGroup($q, $http) {
    var CaseNoteDomainGroup = null;

    CaseNoteDomainGroup = persistence.define('CaseNoteDomainGroup', {
      note: 'TEXT',
      createdAt: 'DATE',
      updatedAt: 'DATE'
    });

    return {
      init: _init,
      all: _all,
      entity: CaseNoteDomainGroup,
      save: _save
    };

    function _init() {
      persistence.schemaSync();
    }

    function _all() {

    }

    function _save() {

    }
  }
})();