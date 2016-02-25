(function(){
    "use strict";

  angular
    .module('cif', [
      'ionic',
      'cif-constants',
      'ionic-material',
      'ngCordova',
      'angular.filter',
      'ng-token-auth',
      'ngCookies',
      'pascalprecht.translate'
    ])

    .run(function($ionicPlatform, Setup, $rootScope, $ionicLoading, $state, $ionicPopup) {

      $rootScope.$on('loading:show', function() {
        $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner>'});
      })

      $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide();
      })

      $rootScope.$on('auth:login-success', function() {
        $state.go('root.clients');
      });

      $rootScope.$on('auth:login-error', function(ev, reason) {
        var alertPopup = $ionicPopup.alert({
              title: 'Login Error',
              template: 'Invalid email or password.<br>Please try again.'
            });
      });

      $rootScope.$on('auth:logout-success', function(response) {
        $state.go('app.login');
      });

      $rootScope.$on('auth:validation-error', function(ev, response) {
        var alertPopup = $ionicPopup.alert({
              title: 'Validation Error',
              template: 'Please login again.'
            });

            alertPopup.then(function(res) {
              $state.go('app.login');
            });
      })

      $rootScope.$on('auth:session-expired', function(response) {
        $state.go('app.login');
      })

      $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    })
})();