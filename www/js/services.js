angular.module('strikethru.services', [])
  .service('Calendar', function($cordovaCalendar) {
    return {
      createEvent: function(todo) {
        $cordovaCalendar.createEventInteractively({
          title: todo.title,

          notes: todo.description,
          startDate: todo.date,
          endDate: todo.date
        }).then(function(result) {
          console.log("Event created successfully");
        }, function(err) {
          console.error("There was an error: " + err);
        });
      }
    }
  })
  .service('ChoosePriorityPopup', function($rootScope, $ionicModal, Todos, Setup) {

    var showPopup = function($scope, todo) {
      $scope = $scope || $rootScope.$new();
      $scope.todo = todo;
      $scope.todos = Todos.list();
      if (Setup.rule135()) {
        $scope.availablePriorityValues = [1, 3, 5];
      } else {
        $scope.availablePriorityValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      }

      $ionicModal.fromTemplateUrl('templates/priority-input.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modalPriority = modal;
        $scope.modalPriority.show();
      });

    }
    var selectAndClose = function($scope) {
      $scope.modalPriority.remove();
    }
    return {
      show: showPopup,
      selectAndClose: selectAndClose
    }
  })
  .service('VaultPopup', function($rootScope, $ionicModal, $state, Vault, Todos) {

    var moveToList = function(todo, list, listId, autosave) {
      Todos.remove(todo).then(function(ref) {

        var aTodo = {}
        if (todo.title) {
          aTodo.title = todo.title;
        }
        if (todo.description) {
          aTodo.description = todo.description;
        }
        if (todo.date) {
          aTodo.date = todo.date;
        }
        if (todo.done) {
          aTodo.done = todo.done;
        }
        if (todo.priority) {
          aTodo.priority = todo.priority;
        }
        aTodo.list = list;
        if (listId) {
          aTodo.listId = listId;
        }
        Todos.save(aTodo).then(function(ref) {
          console.log("Task moved between lists successfully");
          if (autosave) {
            autosave.enabled = true;
          }
          var state = aTodo.list == 'vault' ? 'tab.vault-detail' : "tab." + aTodo.list;
          var objParams = {};
          if (aTodo.listId) {
            objParams.vaultId = aTodo.listId
          }
          $state.go(state, objParams, {
            location: 'replace'
          });
        }, function() {
          console.error("Error moving task from list:", error);
          if (autosave) {
            autosave.enabled = true;
          }
        });
      });
    };


    var showPopup = function($scope, todo, list) {
      $scope = $scope || $rootScope.$new();
      $scope.vaultCategories = Vault.all();
      if ($scope.autosave) {
        $scope.autosave.enabled = false;
      }
      $scope.todo = todo;
      $scope.currentListId = todo.listId ? todo.listId : null;
      if (list == 'vault' && $scope.vaultCategories.length > 0) {

        $ionicModal.fromTemplateUrl('templates/vault-popup.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modalVault = modal;
          $scope.modalVault.show();
        });

      } else {
        moveToList($scope.todo, list, null, $scope.autosave);

      }
    }
    var selectAndClose = function($scope, vault) {
      $scope.modalVault.remove();
      moveToList($scope.todo, 'vault', vault.$id, $scope.autosave);
    }
    return {
      show: showPopup,
      selectAndClose: selectAndClose
    }
  })
  .service('Confirm', function($ionicPopup) {

    var showConfirm = function(title, template, callback, item, autosave) {
      var confirmPopup = $ionicPopup.confirm({
        title: title,
        template: template
      });

      confirmPopup.then(function(res) {
        if (res) {
          if (autosave) {
            autosave.enabled = true;
          }
          return callback(item);

        }
      });
    };
    return {
      show: showConfirm
    }
  })
  .service('CurrentListService', function($state) {
    return {
      get: function() {
        if ($state.includes('tab.livelist') || $state.includes('tab.livelist-detail')) {
          return {
            list: 'livelist'
          }
        } else if ($state.includes('tab.dump') || $state.includes('tab.dump-detail')) {
          return {
            list: 'dump',
          }
        } else if ($state.includes('tab.vault-detail') || $state.includes('tab.vault-todo-detail')) {
          return {
            list: 'vault',
            id: $state.params.vaultId
          }
        } else {
          return {}
        };
      }
    }
  })
  .service('Setup', function($firebaseObject, SETUP, $state) {
    var database = firebase.database();
    var userId = firebase.auth().currentUser.uid;
    var setupRef = firebase.database().ref('users/' + userId + '/setup');

    var setup = $firebaseObject(setupRef);
    setup.$loaded().then(function() {
      if (!setup.strikethru) {
        setup.strikethru = "Standard";
      }
    });

    //Default values
    return {
      check: function(check) {
        return (SETUP.STRIKETHRU[setup.strikethru] >= SETUP.STRIKETHRU[check])
      },
      strikethru: function(value) {
        if (value) {
          setup.strikethru = value;
        }
        return setup.strikethru || 'Standard'; //Lite|Standard|Pro
      },
      rule135: function(value) {
        if (value) {
          setup.rule135 = value;
        }
        return setup.rule135 || false;
      },

      syncInScope: function($scope) {

        setup.$bindTo($scope, "setup").then(function() {});
      }
    }
  })
  .factory('Todos', function($firebaseArray, CurrentListService) {
    var database = firebase.database();
    var userId = firebase.auth().currentUser.uid;
    var livelistRef = firebase.database().ref('users/' + userId + '/todos').child('livelist');
    var dumpRef = firebase.database().ref('users/' + userId + '/todos').child('dump');
    var vaultRef = firebase.database().ref('users/' + userId + '/todos').child('vault');

    var livelist = $firebaseArray(livelistRef);
    var dump = $firebaseArray(dumpRef);
    var vault = {};

    var getArray = function(list, vaultId) {
      if ('livelist' == list) {
        return livelist;
      } else if ('dump' == list) {
        return dump;
      } else if ('vault' == list) {
        if (vault[vaultId]) {
          return vault[vaultId];
        } else {
          var userId = firebase.auth().currentUser.uid;
          var vaultRef = firebase.database().ref('users/' + userId + '/todos/vault/' + vaultId).child('list');
          vault[vaultId] = $firebaseArray(vaultRef);
        }
        return vault[vaultId];
      }
    }
    var clearObject = function(item) {
      Object.keys(item).forEach(function(prop) {
        delete item[prop];
      });
    }
    var save = function(todo) {
      var array = getArray(todo.list, todo.listId);
      if (todo.$id) {
        return array.$save(todo);
      } else {
        return array.$add(todo);
      }
    }
    var list = function() {
      var state = CurrentListService.get();
      if (state.list == 'livelist') {
        return livelist;
      }
      if (state.list == 'dump') {
        return dump;
      }
      if (state.list == 'vault') {

        return getArray(state.list, state.id);
      }
    };
    var remove = function(todo) {
      var array = getArray(todo.list, todo.listId);
      if (todo.$id) {
        return array.$remove(todo);
      }
    };
    var get = function(todoId) {
      var state = CurrentListService.get();
      var array = getArray(state.list, state.id);
      return array.$getRecord(todoId)
    };

    var clearDoneTasks = function() {
      var deletedTasks = [];
      angular.forEach(livelist, function(task, idx) {
        if (task.done) {
          livelist.$remove(task);
          this.push(task);
        }
      }, deletedTasks);
      angular.forEach(dump, function(task, idx) {
        if (task.done) {
          dump.$remove(task);
          this.push(task);
        }
      }, deletedTasks);
      angular.forEach(vault, function(item, key) {
        angular.forEach(item, function(task, idx) {
          if (task.done) {
            item.$remove(task);
            this.push(task);
          }
        }, deletedTasks);
      }, deletedTasks);
      console.table(deletedTasks);
    }
    return {
      list: list,
      remove: remove,
      get: get,
      save: save,
      clearDoneTasks: clearDoneTasks
    };
  })
  .factory('Vault', function($firebaseArray, $firebaseObject, $ionicPopup) {
    var database = firebase.database();
    var userId = firebase.auth().currentUser.uid;
    var vaultRef = firebase.database().ref('users/' + userId + '/todos').child('vault');
    var vault = $firebaseArray(vaultRef);

    return {
      all: function() {
        return vault;
      },
      remove: function(category) {
        vault.$remove(category).then(function(ref) {
          // data has been deleted locally and in the database
          console.log("Vault category successfully removed");
        }, function(error) {
          console.error("Error deleting Vault category:", error);
        });
      },
      get: function(categoryId) {
        if (categoryId) {
          return vault.$getRecord(categoryId);
        }
      },
      save: function(category) {
        if (category.$id) {
          return vault.$save(category);
        } else {
          category.list = [];
          return vault.$add(category);
        }
      }
    };
  });
