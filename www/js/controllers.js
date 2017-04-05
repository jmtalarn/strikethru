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
  .controller('DumpCtrl', function($scope, Todos, Setup) {

    $scope.todos = [];
  })
  .controller('VaultCtrl', function($scope, Vault, Confirm, LABELS) {

    $scope.vaultItems = Vault.all();
    $scope.remove = function(vault) {
      Confirm.show(LABELS.DELETE.VAULT.TITLE, LABELS.DELETE.VAULT.TEMPLATE, Vault.remove, vault);
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
  .controller('TodoDetailCtrl', function($scope, $stateParams, Todos, Vault, $timeout, VaultPopup, CurrentListService, Confirm, LABELS, Setup) {
    var timeout = null;
    var state = CurrentListService.get();
    $scope.checkSetup = Setup.check;

    $scope.todo = $stateParams.todoId ? Todos.get($stateParams.todoId) : {
      list: state.list,
      listId: (state.id ? state.id : null)
    }; //Set current list

    $scope.autosave = {
      enabled: true
    };

    $scope.moveToList = function(list) {

      VaultPopup.show($scope, list);

    };
    $scope.selectAndClose = function(vault) {
      VaultPopup.selectAndClose($scope, vault);
    };
    var update = function() {
      if ($scope.todo.title || $scope.todo.description) {
        if (!$scope.todo.list) {
          var state = CurrentListService.get();
          $scope.todo.list = state.list;
          if (state.id) {
            $scope.todo.listId = state.id;
          }
        }

        Todos.save($scope.todo).then(function(ref) {
          $scope.todo = Todos.get(ref.key);
        }, function(error) {
          console.error("Error saving Todo task: " + error);
        });
      }
    };
    $scope.remove = function(todo) {
      $scope.autosave.enabled = false;
      if (timeout) {
        $timeout.cancel(timeout);
      }
      Confirm.show(LABELS.DELETE.TODO.TITLE, LABELS.DELETE.TODO.TEMPLATE, Todos.remove, todo, $scope.autosave)
      .then(function(ref) {
        // data has been deleted locally and in the database
        console.log("Todo task  successfully removed");
        clearObject(todo);
      }, function(error) {
        console.error("Error deleting Todo task:", error);
      });
    };

    $scope.hideButton = function(button) {
      return (button == CurrentListService.get().list);
    }
    $scope.$watch('todo', function(newVal, oldVal) {
      if (newVal != oldVal && $scope.autosave.enabled) {
        if (timeout) {
          $timeout.cancel(timeout)
        }
        timeout = $timeout(update, 2000); // 1000 = 1 second

      }
    }, true);
  })
  .controller('SetupCtrl', function($scope, Setup, $timeout, Todos, Confirm, LABELS) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.settings = {
          user: user
        };
        Setup.syncInScope($scope);

        $scope.clearDoneTasks = {
          running: false,
          run: function() {
            $scope.clearDoneTasks.running = true;

            Confirm.show(LABELS.DELETE.CLEAR.TITLE, LABELS.DELETE.CLEAR.TEMPLATE, function() {

              Todos.clearDoneTasks();
              $scope.clearDoneTasks.running = false;
            });

          }
        };
      }
    });
  });
