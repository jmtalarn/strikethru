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

  .controller('VaultDetailCtrl', function($scope, $stateParams, Vault, Todos, $timeout) {
    var timeout = null;
    $scope.todos = Todos.all();
    $scope.vault = $stateParams.vaultId ? Vault.get($stateParams.vaultId) : {};
    $scope.generateInitials = function() {
      if ($scope.vault.name) {
        var letters = $scope.vault.name.match(/\b\w/g) || [];
        if (letters.length == 1) {
          $scope.vault.label = $scope.vault.name.substr(0, 2).replace(/\s(.)/g, function($1) {
            return $1.toUpperCase();
          })
        } else {
          $scope.vault.label = letters.join("").substr(0, 4).toUpperCase();
        }
      }

    }
    var update = function() {
      if (!$scope.vault.label || $scope.vault.label.trim()==""){
        $scope.generateInitials();
      }
      if (!Vault.save($scope.vault)){
        console.error("Error saving Vault category");
      }
    };

    $scope.$watch('vault', function(newVal, oldVal) {
      if (newVal != oldVal) {
        if (timeout) {
          $timeout.cancel(timeout)
        }
        timeout = $timeout(update, 1000); // 1000 = 1 second

      }
    }, true);





  })
  .controller('TodoDetailCtrl', function($scope, $stateParams, Todos, $timeout) {
    var timeout = null;
    $scope.todo = Todos.get($stateParams.todoId);
    var update = function() {
      if (!Todos.save($scope.todo)){
        console.error("Error saving Todos category");
      }
    };

    $scope.$watch('todo', function(newVal, oldVal) {
      if (newVal != oldVal) {
        if (timeout) {
          $timeout.cancel(timeout)
        }
        timeout = $timeout(update, 1000); // 1000 = 1 second

      }
    }, true);
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
