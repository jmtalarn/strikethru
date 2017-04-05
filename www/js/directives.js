angular.module('strikethru.directives', [])
  .directive('todoList', function(Setup) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'templates/todo-list.html',
      link: function($scope, $element, $attrs) {
        $scope.baseHref = location.hash;
      },
      controller: function($scope, Todos, Confirm, LABELS, VaultPopup) {


        $scope.checkSetup = Setup.check;

        $scope.todos = Todos.list();

        $scope.remove = function(todo) {
          Confirm.show(LABELS.DELETE.TODO.TITLE, LABELS.DELETE.TODO.TEMPLATE, Todos.remove, todo, $scope.autosave)
          .then(function(ref) {
            // data has been deleted locally and in the database
            console.log("Todo task  successfully removed");
            clearObject(todo);
          }, function(error) {
            console.error("Error deleting Todo task:", error);
          });
        };
        $scope.moveToList = function(list) {

          VaultPopup.show($scope, list);

        };
        $scope.selectAndClose = function(vault) {
          VaultPopup.selectAndClose($scope, vault);
        };
        $scope.onSwipeRight = function(todo) {
          todo.done = true;
          Todos.save(todo);

        }
        $scope.hideButton = function(button) {
          return (button == $scope.currentList);
        }
      }
    }
  })
  .directive('readMore', function() {
    return {
      restrict: 'A',
      scope: {
        text: '=',
        limit: '='
      },
      controller: function($scope) {

        var expanded = true;

        $scope.toggleText = function() {

          if (expanded) {
            $scope.showedText = $scope.text.substr(0, $scope.limit);
            $scope.showedText += " ... ";
            $scope.linkText = "Read more ";
            expanded = false;
          } else {
            $scope.showedText = $scope.text;
            $scope.linkText = " Read less "
            expanded = true;
          }

        };
      },
      template: '{{showedText}}<a ng-click="toggleText()">{{linkText}}</a>',

      link: function($scope, $element, $attrs) {
        $scope.toggleText();
      }
    }
  });
