angular.module('mumblr.controllers', [])

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // $scope.$on('$ionicView.enter', function(e) {
  // });


.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  $scope.snippet = "<h1>Rendering HTML within ionic. Yayyy!!</h1>";

  $scope.posts_right = [];
  for (var i=0; i < 10; i++) {
    $scope.posts_right[i] = {
      name: 'Post ' + i.toString()
    };
  }

  $scope.groups = [];
  for (var i=0; i<2; i++) {
      $scope.groups[i] = {
        name: i,
        items: []
      };
      for (var j=0; j<8; j++) {
        $scope.groups[i].items.push( ' Sub-item -' + j);
      }
  }
  
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('BookmarksCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('HomeCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

  // $ionicSlideBoxDelegate.update();
  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }

})
