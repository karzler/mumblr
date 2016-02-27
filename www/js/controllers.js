var TUMBLR_CONSUMER_KEY =  "nN1exTh0UWcevkH0LY5QyNaRQACwQ9BpjA3KQp97MXS3as3Hpg";
var TUMBLR_SECRET_KEY = "ADZPKEd4KbNCOjG9tHVgzofIACLfefmgCWDdb7KO3h1VbhL8SN";
var TUMBLR_BLOG_NAME = "fitcruncher";
var posts_url = "http://api.tumblr.com/v2/blog/" + TUMBLR_BLOG_NAME + ".tumblr.com/posts?api_key=" + TUMBLR_CONSUMER_KEY + "&callback=JSON_CALLBACK";
var tumblr_posts;

angular.module('mumblr.controllers', [])

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // $scope.$on('$ionicView.enter', function(e) {
  // });


.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {

  //$scope.snippet = "<h1>Rendering HTML within ionic. Yayyy!!</h1>";

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

.controller('PostsCtrl', function($scope, $http) {

  var fetch_posts = function() {
    // Posts fetched here
    $http.jsonp(posts_url)
      .success(function(data) {
        console.log("Tumblr Posts")
        console.log(data.response.posts);
        tumblr_posts = data.response.posts;
        $scope.posts = tumblr_posts;
      })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };

  // Call once at beginning
  fetch_posts();



  $scope.doRefresh = function(data) {
    // TODO: Perhaps, fetch only new posts on pull down and not all
    fetch_posts();
  }
})
