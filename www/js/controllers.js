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
    $scope.todos = [];
  })
  .controller('DumpCtrl', function($scope, Todos) {
    $scope.todos = [];
  })
  .controller('VaultCtrl', function($scope, Vault) {

    $scope.vaultItems = Vault.all();
    $scope.remove = function(vault) {
      Vault.remove(vault);
    };
  })

  .controller('VaultDetailCtrl', function($scope, $stateParams, Vault, Todos, $timeout) {
    var timeout = null;

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
      if (!$scope.vault.label || $scope.vault.label.trim() == "") {
        $scope.generateInitials();
      }
      Vault.save($scope.vault).then(function(ref) {
        $scope.vault = Vault.get(ref.key);
      }, function(error) {
        console.error("Error saving Vault category");
      });
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
  .controller('TodoDetailCtrl', function($scope, $stateParams, Todos, $timeout, CurrentListService) {
    var timeout = null;
    $scope.todo = $stateParams.todoId ? Todos.get($stateParams.todoId) : {};
    var update = function() {
      var state = CurrentListService.get();
      $scope.todo.list = state.list;
      if (state.id){ $scope.todo.listId = state.id;}

      Todos.save($scope.todo).then(function(ref) {
        $scope.todo = Todos.get(ref.key);
      }, function(error) {
        console.error("Error saving Todo task");
      });
    };
    $scope.hideButton = function(button) {
      return (button == CurrentListService.get().list);
    }
    $scope.$watch('todo', function(newVal, oldVal) {
      if (newVal != oldVal) {
        if (timeout) {
          $timeout.cancel(timeout)
        }
        timeout = $timeout(update, 2000); // 1000 = 1 second

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
