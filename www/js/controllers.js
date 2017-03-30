angular.module('strikethru.controllers', [])
  /*
      ionicSideMenuDelegate : used to access the slidable functionality of the menu drawer
  */
  .controller('loginCtrl', function($scope, $ionicHistory, $state) {
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //Removes back link to login page
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });

        $state.go('tab.livelist', {}, {
          location: "replace"
        });

      }
    });
    $scope.logout = function() {
      firebase.auth().signOut().then(function() {
        $state.go('login', {}, {
          location: "replace"
        });
      }, function(error) {
        console.error(error);
      });
    }
    $scope.loginGoogle = function() {
      var auth = firebase.auth();

      var provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).then(function(result) {
        console.log(result.user);
        var uid = result.user.uid;
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });

    };


  })
  .controller('LivelistCtrl', function($scope, Todos) {
    $scope.todos = Todos.all();

  })
  .controller('DumpCtrl', function($scope, Todos) {
    $scope.todos = Todos.all();
  })
  .controller('VaultCtrl', function($scope, Vault) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.vaultItems = Vault.all();
    $scope.remove = function(vault) {
      Vault.remove(vault);
    };
  })

  .controller('VaultDetailCtrl', function($scope, $stateParams, Vault, Todos) {
    $scope.todos = Todos.all();
    $scope.vault = Vault.get($stateParams.vaultId);
  })
  .controller('TodoDetailCtrl', function($scope, $stateParams) {
    $scope.todo = { id: $stateParams.todoId, title: "Title", description: "Description", date: new Date()}; //Vault.get($stateParams.vaultId);
  })
  .controller('SetupCtrl', function($scope) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.settings = {
          user: user
        };

      }
    });
  });
