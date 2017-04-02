angular.module('strikethru.services', [])
  .service('ConfirmRemove', function($ionicPopup) {

    var showConfirm = function(Service, item) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete',
        template: 'Are you sure you want to delete this item?'
      });

      confirmPopup.then(function(res) {
        if (res) {
          Service.remove(item);
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
  .factory('Setup', function($firebaseObject) {
    var database = firebase.database();
    var userId = firebase.auth().currentUser.uid;
    var setupRef = firebase.database().ref('users/' + userId + '/setup');
    var setup = $firebaseObject(setupRef);
    return {
      load: function($scope) {

        setup.$bindTo($scope, "setup").then(function() {
          console.log($scope.setup); // { foo: "bar" }
          $scope.setup.setup

        });
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
    return {
      list: function() {
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
      },

      remove: function(todo) {
        var array = getArray(todo.list, todo.listId);
        if (todo.$id) {
          array.$remove(todo).then(function(ref) {
            // data has been deleted locally and in the database
            console.log("Todo task  successfully removed");
            clearObject(todo);
          }, function(error) {
            console.error("Error deleting Todo task:", error);
          });
        } else {
          clearObject(todo);
        }
      },
      get: function(todoId) {
        var state = CurrentListService.get();
        var array = getArray(state.list, state.id);
        return array.$getRecord(todoId)
      },
      save: function(todo) {
        var array = getArray(todo.list, todo.listId);
        if (todo.$id) {
          return array.$save(todo);
        } else {
          return array.$add(todo);
        }
      }
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
