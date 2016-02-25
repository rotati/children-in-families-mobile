(function(){
  angular
    .module('cif')
    .factory('Domain', Domain)

  Domain.$inject = ['$q'];

  function Domain($q) {
    var Domain = null;

    Domain = persistence.define('Domain', {
      name: 'TEXT',
      description: 'TEXT',
      identity: 'TEXT',
      createdAt: 'DATE',
      updatedAt: 'DATE'
    });

    return {
      init: _init,
      all: _all,
      entity: Domain,
      findBy: _findBy
    };

    function _init() {
      persistence.schemaSync();
    }

    function _all() {
      var defer = $q.defer();

      Domain.all().list(null, function(response) {
        defer.resolve(response);
      })
      return defer.promise;
    }

    function _findBy(field, value) {
      var defer = $q.defer();

      Domain.findBy(field, value, function(result) {
        defer.resolve(result);
      })

      return defer.promise;
    }
  }
})()
