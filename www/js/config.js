(function() {
  'use strict';

  angular
    .module('cif')
    .config(Config)

  Config.$inject = ['$authProvider', 'API', '$translateProvider'];

  function Config($authProvider, API, $translateProvider) {
    $authProvider.configure({
      apiUrl: API.host
    });

    $translateProvider
      .useStaticFilesLoader({
        prefix: 'js/locales/',
        suffix: '.json'
      })
      .registerAvailableLanguageKeys(['en', 'km'], {
        'en' : 'en',
        'km' : 'km'
      })
      .preferredLanguage('km')
      .useLocalStorage()
      .useSanitizeValueStrategy('escapeParameters');
    window.translate = $translateProvider
  }
})();
