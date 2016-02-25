(function() {
  'use strict';

  angular
    .module('cif')
    .factory('CaseNoteDomainGroupChangeLog', CaseNoteDomainGroupChangeLog)

  CaseNoteDomainGroupChangeLog.$inject = ['$q', '$http'];

  function CaseNoteDomainGroupChangeLog($q, $http) {
    var CaseNoteDomainGroup = null;

    CaseNoteDomainGroup = persistence.define('CaseNoteDomainGroupCL', {
      note: 'TEXT',
      createdAt: 'DATE',
      updatedAt: 'DATE'
    });

    return {
      init: _init,
      entity: CaseNoteDomainGroup,
      save: _save
    };

    function _init() {
      persistence.schemaSync();
    }

    function _save() {

    }
  }
})();