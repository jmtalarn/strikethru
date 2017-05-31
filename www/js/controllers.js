angular.module('strikethru.controllers', [])
  .controller('logoutCtrl', function($scope, $ionicHistory, $state, Auth) {
    Auth.logout();
  })
  .controller('loginCtrl', function($scope, Auth) {
    $scope.logout = function() {
      Auth.logout();
    }
    $scope.loginGoogle = function() {
      Auth.login();

      // var auth = firebase.auth();
      //
      // var provider = new firebase.auth.GoogleAuthProvider();
      // auth.signInWithPopup(provider).then(function(result) {
      //   console.log(result.user);
      //   var uid = result.user.uid;
      // }).catch(function(error) {
      //   console.error("Authentication failed:", error);
      // });

    };


  })
  .controller('LoadingCtrl', function(Setup) {
    console.log("Loading ... waiting for something...");
  })
  .controller('TabCtrl', function($scope, Setup, Auth) {

    $scope.checkSetup = function(tab) {
      if (Setup.check(tab)) {
        return "ng-show";
      } else {
        return "ng-hide";
      }
    }
  })
  .controller('LivelistCtrl', function($scope, Todos) {
    //Setup.syncInScope($scope);
    $scope.todos = [];
    $scope.currentList = "livelist";
  })
  .controller('DumpCtrl', function($scope, Todos) {
    $scope.todos = [];
    $scope.currentList = "dump";
  })
  .controller('VaultCtrl', function($scope, Vault, Confirm, LABELS) {

    $scope.vaultItems = Vault.all();
    $scope.remove = function(vault) {
      Confirm.show(LABELS.DELETE.VAULT.TITLE, LABELS.DELETE.VAULT.TEMPLATE, Vault.remove, vault);
    };
  })

  .controller('VaultDetailCtrl', function($scope, $stateParams, Vault, Todos, $timeout) {
    var timeout = null;
    $scope.currentList = "vault";
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
  .controller('TodoDetailCtrl', function($scope, $stateParams, Todos, Vault, $timeout, VaultPopup, ChoosePriorityPopup, CurrentListService, Confirm, LABELS, Setup, $state, Calendar) {
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



    $scope.createEvent = function() {
      Calendar.createEvent($scope.todo)
    }
    $scope.choosePriority = function($event, todo) {
      $event.preventDefault();
      ChoosePriorityPopup.show($scope, todo);
    }
    $scope.selectPriorityAndClose = function() {
      ChoosePriorityPopup.selectAndClose($scope);
    }
    $scope.moveToList = function(list) {
      VaultPopup.show($scope, $scope.todo, list);
    };
    $scope.selectVaultAndClose = function(vault) {
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
      Confirm.show(LABELS.DELETE.TODO.TITLE, LABELS.DELETE.TODO.TEMPLATE,
        function(el) {
          Todos.remove(el);
          var state = el.list == 'vault' ? 'tab.vault-detail' : "tab." + el.list;
          var objParams = {};
          if (el.listId) {
            objParams.vaultId = el.listId
          }
          $state.go(state, objParams, {
            location: 'replace'
          });
        }, todo, $scope.autosave)

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
  .controller('SetupCtrl', function($scope, $timeout, Todos, Confirm, LABELS, Setup, Auth) {

    Setup.syncInScope($scope);
    $scope.currentUser = Auth.getCurrentUser();
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

  });
