(function(){
  'use strict'

  angular
    .module('cif')
    .config(Router)

  Router.$inject = ['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', '$ionicConfigProvider'];

  function Router($stateProvider, $urlRouterProvider, $sceDelegateProvider, $ionicConfigProvider){

    $ionicConfigProvider.views.maxCache(0);

    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://localhost:3000/**'
    ]);

    $stateProvider

      .state('root', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/app/menu.html',
        controller: 'RootCtrl as vm'
      })

      .state('app', {
        url: '/auth',
        templateUrl: 'templates/app/account.html'
      })

      .state('root.clients', {
        url: '/clients',
        views: {
          'menuContent': {
            templateUrl: 'templates/clients/index.html',
            controller: 'ClientIndexCtrl as vm'
          }
        }
      })

      .state('root.clients.show', {
        url: '/:id',
        views: {
          'menuContent@root': {
            templateUrl: 'templates/clients/show.html',
            controller: 'ClientShowCtrl as vm'
          }
        }
      })

      .state('root.clients.caseNotes', {
        url: '/:clientId/case_notes',
        views: {
          'menuContent@root': {
            templateUrl: 'templates/clients/case_notes/index.html',
            controller: 'CaseNoteIndexCtrl as vm'
          }
        }
      })

      .state('root.clients.caseNotes.new', {
        url: '/new',
        views: {
          'menuContent@root': {
            templateUrl: 'templates/clients/case_notes/new.html',
            controller: 'CaseNoteNewCtrl as vm'
          },
          'tasks@menuContent': {
            templateUrl: 'templates/clients/tasks/task.html',
            controller: 'TaskCtrl as vm'
          }
        }
      })

      .state('root.clients.assessments', {
        url: '/:clientId/assessments',
        views: {
          'menuContent@root': {
            templateUrl: 'templates/clients/assessments/index.html',
            controller: 'AssessmentIndexCtrl as vm'
          }
        }
      })

      .state('root.clients.tasks', {
        url: '/:clientId/tasks',
        views: {
          'menuContent@root': {
            templateUrl: 'templates/clients/tasks/index.html',
            controller: 'TaskIndexCtrl as vm'
          }
        }
      })

      .state('root.clients.tasks.new', {
        url: '/new',
        views: {
          'menuContent@root': {
            templateUrl: 'templates/clients/tasks/new.html',
            controller: 'TaskNewCtrl as vm'
          }
        }
      })

      .state('root.clients.active_tasks', {
        url: '/active_tasks',
        views: {
          'menuContent@root': {
            templateUrl: 'templates/clients/tasks/active_task.html',
            controller: 'ActiveTaskCtrl as vm'
          }
        }
      })

      .state('root.clients.assessments.show', {
        url: '/:id',
        views: {
          'menuContent@root': {
            templateUrl: 'templates/clients/assessments/show.html',
            controller: 'AssessmentShowCtrl as vm'
          }
        }
      })

      .state('root.clients.assessments.new', {
        url: '/new',
        views: {
          'menuContent@root': {
            templateUrl: 'templates/clients/assessments/new.html',
            controller: 'AssessmentNewCtrl as vm'
          }
        }
      })

      .state('root.clients.assessments.tasks', {
        url: '/:id/tasks'
      })

      .state('root.clients.assessments.tasks.new', {
        url: '/new',
        views: {
          'menuContent@root': {
            templateUrl: 'templates/clients/assessments/tasks/new.html',
            controller: 'AssessmentTaskNewCtrl as vm'
          }
        }
      })

      .state('root.clients.confirm', {
        url: '/:id/confirm',
        views: {
          'menuContent@root': {
            templateUrl: 'templates/clients/confirm.html',
            controller: 'ClientConfirmCtrl as vm'
          }
        }
      })

      .state('app.login',{
        url: '/login',
        views: {
          'login': {
            templateUrl: 'templates/account/login.html',
            controller: 'LoginCtrl as vm'
          }
        }
      })

      $urlRouterProvider.otherwise('/auth/login');
  }

})();
