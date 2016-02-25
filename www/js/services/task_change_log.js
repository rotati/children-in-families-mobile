(function() {
  'use strict';

  angular
    .module('cif')
    .factory('TaskChangeLog', TaskChangeLog)

  TaskChangeLog.$inject = ['$q', '$rootScope'];

  function TaskChangeLog($q, $rootScope) {
    var Task = null,
        date = new Date().toDateString();;

        Task = persistence.define('TaskCL', {
          name: 'TEXT',
          completionDate: 'DATE',
          completed: 'BOOLEAN',
          taskId: 'TEXT',
          remindAt: 'DATE',
          createdAt: 'DATE',
          updatedAt: 'DATE',
        });

    return {
      init: _init,
      entity: Task,
      save: _save,
      markTaskAsComplete: _markTaskAsComplete,
      findBy: _findBy
    }

    function _init() {
      persistence.schemaSync();
    }

    function _save(data) {
      var defer = $q.defer();
      persistence.add(data);

      persistence.flush(function() {
        data = { status: 200 };
        defer.resolve(data);
      });

      return defer.promise;
    }

    function _markTaskAsComplete(data, caseNote) {
      var defer = $q.defer();

      persistence.add(data);
      caseNote.taskChangeLogs.add(data);

      persistence.flush(function() {
        data = { status: 200 };
        defer.resolve(data);
      });

      return defer.promise;
    }

    function _findBy(key, value) {
      var defer = $q.defer();

      Task.all().filter(key, '=', value).list(null, function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }
  }
})();