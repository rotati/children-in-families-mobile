(function() {
  'use strict';

  angular
    .module('cif')
    .factory('Task', Task)

  Task.$inject = ['$q', '$rootScope'];

  function Task($q, $rootScope) {
    var Task = null,
        date = new Date().toDateString();;

        Task = persistence.define('Task', {
          name: 'TEXT',
          completionDate: 'DATE',
          completed: 'BOOLEAN',
          remindAt: 'DATE',
          createdAt: 'DATE',
          updatedAt: 'DATE',
        });

    return {
      init: _init,
      all: _all,
      findBy: _findBy,
      entity: Task,
      save: _save,
      markTaskAsComplete: _markTaskAsComplete,
      upcomingDues: _upcomingDues,
      overDues: _overDues,
      onDues: _onDues,
      upcoming: _upcoming,
      overduesTask: _overduesTask,
      onDuesTask: _onDuesTask
    }

    function _init() {
      persistence.schemaSync();
    }

    function _all() {
      var defer = $q.defer();

      Task.all().list(null, function(response){
        defer.resolve(response);
      })

      return defer.promise;
    }

    function _findBy(field, value) {
      var defer = $q.defer();

      Task.findBy(field, value, function(result) {
        defer.resolve(result);
      })

      return defer.promise;
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
      caseNote.tasks.add(data);

      persistence.flush(function() {
        data = { status: 200 };
        defer.resolve(data);
      });

      return defer.promise;
    }

    function _upcomingDues(tasks) {
      var defer = $q.defer();

      tasks.filter('completionDate', '>', date).filter('completed', '=', 'false').prefetch('domain').order('createdAt', false).list(function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }

    function _overDues(tasks) {
      var defer = $q.defer();

      tasks.filter('completionDate', '<', date).filter('completed', '=', 'false').prefetch('domain').order('createdAt', false).list(function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }

    function _onDues(tasks) {
      var defer = $q.defer();

      tasks.filter('completionDate', '=', date).filter('completed', '=', 'false').prefetch('domain').order('createdAt', false).list(function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }

    function _upcoming() {
      var defer = $q.defer();

      Task.all().filter('completionDate', '>', date).filter('completed', '=', 'false').prefetch('domain').prefetch('case').list(null, function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }

    function _overduesTask() {
      var defer = $q.defer();

      Task.all().filter('completionDate', '<', date).filter('completed', '=', 'false').prefetch('domain').prefetch('case').list(null, function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }

    function _onDuesTask() {
      var defer = $q.defer();

      Task.all().filter('completionDate', '=', date).filter('completed', '=', 'false').prefetch('domain').prefetch('case').list(null, function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }
  }
})();