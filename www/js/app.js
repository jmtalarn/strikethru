// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('strikethru', ['ionic', 'firebase', 'strikethru.controllers', 'strikethru.services', 'strikethru.directives', "ion-datetime-picker"])
  .constant('FIREBASE_ROOT', 'https://strikethru-b4a44.firebaseio.com')
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })
  .config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })
      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.livelist', {
        url: '/livelist',
        views: {
          'tab-livelist': {
            templateUrl: 'templates/tab-livelist.html',
            controller: 'LivelistCtrl'
          }
        }
      })

      .state('tab.vault', {
        url: '/vault',
        views: {
          'tab-vault': {
            templateUrl: 'templates/tab-vault.html',
            controller: 'VaultCtrl'
          }
        }
      })
      .state('tab.vault-detail', {
        url: '/vault/:vaultId',
        views: {
          'tab-vault': {
            templateUrl: 'templates/vault-detail.html',
            controller: 'VaultDetailCtrl'
          }
        }
      })
      .state('tab.vault-todo-detail', {
        url: '/vault/:vaultId/todo/:todoId',
        views: {
          'tab-vault': {
            templateUrl: 'templates/todo-detail.html',
            controller: 'TodoDetailCtrl'
          }
        }
      })
      .state('tab.livelist-detail', {
        url: '/livelist/todo/:todoId',
        views: {
          'tab-livelist': {
            templateUrl: 'templates/todo-detail.html',
            controller: 'TodoDetailCtrl'
          }
        }
      })
      .state('tab.dump', {
        url: '/dump',
        views: {
          'tab-dump': {
            templateUrl: 'templates/tab-dump.html',
            controller: 'DumpCtrl'
          }
        }
      })
      .state('tab.dump-detail', {
        url: '/dump/todo/:todoId',
        views: {
          'tab-dump': {
            templateUrl: 'templates/todo-detail.html',
            controller: 'TodoDetailCtrl'
          }
        }
      })
      .state('tab.setup', {
        url: '/setup',
        views: {
          'tab-setup': {
            templateUrl: 'templates/tab-setup.html',
            controller: 'SetupCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });
