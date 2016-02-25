(function() {
  'use strict';

  angular
    .module('cif')
    .factory('User', User)

  User.$inject = ['$auth', '$q'];

  function User($auth, $q) {
    var limit       = 20,
        skip        = 0;

    return {
      currentUser: _getUser
    };

    function _getUser() {
      var defer = $q.defer();

      $auth.validateUser().then(function(response) {
        defer.resolve(response);
      });

      return defer.promise;
    }
  }
})()