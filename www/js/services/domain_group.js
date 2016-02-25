(function(){
  angular
    .module('cif')
    .factory('DomainGroup', DomainGroup)

  DomainGroup.$inject = ['$q'];

  function DomainGroup($q) {
    var DomainGroup = null;

    DomainGroup = persistence.define('DomainGroup', {
      name: 'TEXT',
      description: 'TEXT'
    });

    return {
      init: _init,
      all: _all,
      entity: DomainGroup
    };

    function _init() {
      persistence.schemaSync();
    }

    function _all() {
      var defer = $q.defer();

      DomainGroup.all().list(null, function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }
  }
})()
