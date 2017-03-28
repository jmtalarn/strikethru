angular.module('strikehru.controllers', [])
/*
    ionicSideMenuDelegate : used to access the slidable functionality of the menu drawer
*/
.controller('loginCtrl', function($scope) {

    // //Check if user already logged in
    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //
		// //Removes back link to login page
    //     $ionicHistory.nextViewOptions({
    //       historyRoot: true
    //     });
    //
    //     $state.go('dash', {}, {location: "replace"});
    //
    //   }
    // });

    $scope.loginGoogle = function(){
      alert("Hola google");
      //Gmail Login
    };


})
.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
