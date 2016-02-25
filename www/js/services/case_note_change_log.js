(function(){
  angular
    .module('cif')
    .factory('CaseNoteChangeLog', CaseNoteChangeLog)

  CaseNoteChangeLog.$inject = ['$q', 'CaseNoteDomainGroup', '$rootScope'];

  function CaseNoteChangeLog($q, CaseNoteDomainGroup, $rootScope) {
    var CaseNote = null,
        limit    = 1,
        skip     = 0;

        CaseNote = persistence.define('CaseNoteCL', {
          caseNoteId: 'TEXT',
          attendee: 'TEXT',
          meetingDate: 'DATE',
          createdAt: 'DATE',
          updatedAt: 'DATE'
        });

    return {
      init: _init,
      all: _all,
      entity: CaseNote,
      save: _save,
    };

    function _init() {
      persistence.schemaSync();
    }

    function _all(options) {
      var defer = $q.defer();
      _setPagination(options);

      CaseNote.all().filter('case', '=', options.caseId).limit(limit).skip(skip).prefetch('case').prefetch('assessment').list(null, function(response){
        defer.resolve(response);
      })

      return defer.promise;
    }

    function _save(caseNote) {
      var defer = $q.defer();

      persistence.add(caseNote);

      // angular.forEach(caseNote.noteDomainGroups, function(noteDomainGroup) {
      //   var noteDomainGroupObj = new CaseNoteDomainGroupChangeLog.entity(noteDomainGroup);
      //   noteDomainGroupObj.createdAt = new Date();
      //   noteDomainGroupObj.updatedAt = new Date();

      //   persistence.add(noteDomainGroupObj);
      //   caseNote.caseNoteDomainGroups.add(noteDomainGroupObj);
      // });

      persistence.flush(function() {
        var data = {status: 200};

        defer.resolve(data);
      });

      return defer.promise;
    }

    function _setPagination(options) {
      if(angular.isDefined(options)){
        limit = options['limit'];
        skip  = (options['page'] - 1) * limit;
      }
    }

    function _total(options) {
      var defer = $q.defer();

      CaseNote.all().count(function(response) {
        var total = Math.ceil(response / options.limit);
        defer.resolve(total);
      })

      return defer.promise;
    }


    function _filterByCase(id) {
      var defer = $q.defer();

      CaseNote.all().filter('case', '=', id).count(function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }

    function _tasks(caseNote) {
      var defer = $q.defer();

      caseNote.tasks.list(function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }
  }
})()
