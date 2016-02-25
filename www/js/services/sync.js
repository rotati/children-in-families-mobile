(function() {
  'use strict';

  angular
    .module('cif')
    .factory('Sync', Sync)

  Sync.$inject = ['Setup'];

  function Sync(Setup) {
    return {
      sync: _sync,
      upload: _upload
    }

    function _sync() {
      _clear();
    }

    function _clear() {
      persistence.reset(null, function() {
        Setup.init();
      });
    }

    function _upload() {

    }
  }
})();