(function(){
  'use strict';
  angular
    .module('cif')
    .controller('LoginCtrl', LoginCtrl)

  LoginCtrl.$inject = ['$state', '$auth', '$rootScope'];

  function LoginCtrl($state, $auth, $rootScope) {
    var vm = this;

    vm.user  = {};
    vm.error = {}
    vm.login = _login;

    function _login() {
      $state.go('root.clients');
    }
  }
})();
