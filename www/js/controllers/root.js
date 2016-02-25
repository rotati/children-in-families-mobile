(function() {
  'use strict';

  angular
    .module('cif')
    .controller('RootCtrl', RootCtrl)

  RootCtrl.$inject = ['$ionicSideMenuDelegate', 'ionicMaterialInk', 'ionicMaterialMotion', '$timeout', '$state', '$auth', 'User', '$rootScope', '$ionicPopover', '$scope', '$translate'];

  function RootCtrl($ionicSideMenuDelegate, ionicMaterialInk, ionicMaterialMotion, $timeout, $state, $auth, User, $rootScope, $ionicPopover, $scope, $translate) {
    var vm = this;

    $timeout(function(){
      ionicMaterialInk.displayEffect();
      ionicMaterialMotion.ripple();
    },100);

    vm.toggleLeft     = _toggleLeft;
    vm.goBack         = _goBack;
    vm.goHome         = _goHome;
    vm.logout         = _logout;
    vm.isLogin        = false;
    vm.setting        = { lang: 'km' };
    vm.switchLanguage = _switchLanguage;

    _init();

    function _init() {
      var lang = $translate.use();

      vm.setting.lang = lang;

      User.currentUser().then(function(response) {
        vm.isLogin = true;
      }).catch(function(error) {
        vm.isLogin = false;
      })
    }

    function _toggleLeft() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    function _goBack() {
      $ionicHistory.goBack();
    }

    function _goHome() {
      $state.go('root.clients');
    }

    function _logout() {
      $auth.signOut();
    }

    function _switchLanguage(language) {
      $translate.use(language);
    }
  }
})();