angular.module('strikethru.controllers', [])
  /*
      ionicSideMenuDelegate : used to access the slidable functionality of the menu drawer
  */
  .controller('loginCtrl', function($scope, $ionicHistory, $state, $cordovaGooglePlus) {
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
      $cordovaGooglePlus.login({'webClientId': '219119179196-6bab0a9s9h2kef3bidt31n6ml2iaatq4.apps.googleusercontent.com', 'offline': true})
          .then(function(userData) {
            console.log('good');


            var provider = firebase.auth.GoogleAuthProvider.credential(userData.idToken);
            firebase.auth().signInWithCredential(provider)
                 .then((success) => {
                   console.log("Firebase success: " + JSON.stringify(success));
                   this.displayAlert(JSON.stringify(success),"signInWithCredential successful")
                   this.userProfile = success;

                 })
                 .catch((error) => {
                   console.log("Firebase failure: " + JSON.stringify(error));
                       this.displayAlert(error,"signInWithCredential failed")
                 });

          }, function(err) {
            console.log('error');
            console.log(err);
            if(err=="cordova_not_available"){
              var auth = firebase.auth();

              var provider = new firebase.auth.GoogleAuthProvider();
              auth.signInWithPopup(provider).then(function(result) {
                console.log(result.user);
                var uid = result.user.uid;
              }).catch(function(error) {
                console.error("Authentication failed:", error);
              });
            }
          });

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
  .controller('TabCtrl', function($scope, Setup) {

    $scope.checkSetup=function(tab){
        if (Setup.check(tab)){
          return "ng-show";
        }else{
          return "ng-hide";
        }
    }
  })
  .controller('LivelistCtrl', function($scope, Todos) {
    $scope.todos = [];
    $scope.currentList="livelist";
  })
  .controller('DumpCtrl', function($scope, Todos, Setup) {
    $scope.todos = [];
    $scope.currentList="dump";
  })
  .controller('VaultCtrl', function($scope, Vault, Confirm, LABELS) {

    $scope.vaultItems = Vault.all();
    $scope.remove = function(vault) {
      Confirm.show(LABELS.DELETE.VAULT.TITLE, LABELS.DELETE.VAULT.TEMPLATE, Vault.remove, vault);
    };
  })

  .controller('VaultDetailCtrl', function($scope, $stateParams, Vault, Todos, $timeout) {
    var timeout = null;
    $scope.currentList="vault";
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
  .controller('TodoDetailCtrl', function($scope, $stateParams, Todos, Vault, $timeout, VaultPopup,ChoosePriorityPopup, CurrentListService, Confirm, LABELS, Setup, $state, Calendar) {
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
    $scope.createEvent = function(){
      Calendar.createEvent($scope.todo)
    }
    $scope.choosePriority = function($event,todo){
      $event.preventDefault();
      ChoosePriorityPopup.show($scope, todo);
    }
    $scope.selectPriorityAndClose = function(){
        ChoosePriorityPopup.selectAndClose($scope);
    }
    $scope.moveToList = function(list) {
      VaultPopup.show($scope, list);
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
        function(el){
          Todos.remove(el);
          var state = el.list == 'vault' ? 'tab.vault-detail' : "tab." + el.list ;
          var objParams = { };
          if (el.listId) {
            objParams.vaultId = el.listId
          }
          $state.go(state, objParams, {location:'replace'});
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
