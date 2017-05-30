angular.module('strikethru', ['ionic', 'firebase', 'ngCordova', 'strikethru.controllers', 'strikethru.services', 'strikethru.directives', 'strikethru.constants', "ion-datetime-picker", 'ionic.native'])
  .constant('FIREBASE_ROOT', 'https://strikethru-b4a44.firebaseio.com')
  .run(function($ionicPlatform, $rootScope, $ionicLoading) {
    $ionicPlatform.ready(function() {
      //https://forum.ionicframework.com/t/firebas-and-ionic-issues/48922/4
      document.addEventListener("resume", function() {
        firebase.database().goOnline();
      }, false);

      document.addEventListener("pause", function() {
        firebase.database().goOffline();
      }, false);
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
    })
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
      .state('loading', {
        url: '/loading',
        templateUrl: 'templates/loading.html'
      })
      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'TabCtrl',
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
