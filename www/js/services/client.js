(function() {
  'use strict';

  angular
    .module('cif')
    .factory('Client', Client)

  Client.$inject = ['$q', 'User', 'Case'];

  function Client($q, User, Case) {
    var Client = null,
        limit  = 20,
        skip   = 0;

        Client = persistence.define('Client', {
          name: 'TEXT',
          gender: 'TEXT',
          dateOfBirth: 'DATE',
          caseWorkerName: 'TEXT',
          caseWorkerId: 'INTEGER',
          birthProvince: 'TEXT',
          status: 'TEXT',
          clientId: 'INTEGER',
          createdAt: 'DATE',
          updatedAt: 'DATE'
        });

    return {
      init: _init,
      all: _all,
      findBy: _findBy,
      filterById: _filterById,
      entity: Client,
      filterByCase: _filterByCase
    };

    function _init() {
      persistence.schemaSync();
    }

    function _all(options) {
      var defer = $q.defer();
      _setPagination(options);

      Client.all().filter('caseWorkerId', '=', 1).order('clientId', true).limit(limit).skip(skip).list(null, function (results) {
        defer.resolve(results);
      });

      return defer.promise;
    }

    function _setPagination(options) {
      if(angular.isDefined(options)){
        limit = options['limit'] || limit;
        skip  = options['page'] * limit || skip;
      }
    }

    function _findBy(field, value) {
      var defer = $q.defer();

      Client.findBy(field, value, function(result) {
        defer.resolve(result);
      })

      return defer.promise;
    }

    function _filterById(id) {
      var defer = $q.defer();

      Client.all().filter('id', '=', id).order('createdAt', false).prefetch('case').list(null, function(response) {
        defer.resolve(response);
      });

      return defer.promise;
    }

    function _filterByCase(id) {
      var defer = $q.defer();

      Client.all().filter('case', '=', id).prefetch('case').list(null, function(response) {
        defer.resolve(response);
      })

      return defer.promise;
    }
  }
})()