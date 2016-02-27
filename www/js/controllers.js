var TUMBLR_CONSUMER_KEY =  "nN1exTh0UWcevkH0LY5QyNaRQACwQ9BpjA3KQp97MXS3as3Hpg";
var TUMBLR_BLOG_NAME = "fitcruncher";
var posts_url = "http://api.tumblr.com/v2/blog/" + TUMBLR_BLOG_NAME + ".tumblr.com/posts?api_key=" + TUMBLR_CONSUMER_KEY + "&callback=JSON_CALLBACK";
var POSTS_PER_PAGE = 10;

var get_tumblr_posts_url = function(offset, limit) {
    var offset = offset || "0";
    var limit = limit || String(POSTS_PER_PAGE);
    var posts_url = "http://api.tumblr.com/v2/blog/" + TUMBLR_BLOG_NAME
                    + ".tumblr.com/posts/?api_key=" + TUMBLR_CONSUMER_KEY
                    + "&offset=" + String(offset)
                    + "&limit=" + String(limit)
                    + "&callback=JSON_CALLBACK";
    return posts_url;
};

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

.controller('PostsCtrl', function($scope, $http, $sce) {

  $scope.posts = [];
  $scope.load_more_enabled = true;

  var fetch_posts = function(posts_url, clear) {
    //
    // By detault when posts are fetched they are appended tot he existing array of post objects.
    // When clear=true, all the existing posts in array in memory are cleared.
    //

    $http.jsonp(posts_url)
      .success(function(data) {
        console.log("Tumblr Posts")
        console.log(data.response.posts);
        for(i=0;i<data.response.posts.length;i++){
          data.response.posts[i].body = $sce.trustAsHtml(data.response.posts[i].body);
        }
        tumblr_posts = data.response.posts;

        if (clear) {
            $scope.posts = []
        }
        $scope.posts = $scope.posts.concat(tumblr_posts);

        if (tumblr_posts.length < POSTS_PER_PAGE) {
            $scope.load_more_enabled = false;
            console.log("Load more disabled")
        }
      })

     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
       $scope.$broadcast('scroll.infiniteScrollComplete');
     });
  };

  var default_posts_url = get_tumblr_posts_url();
  // Fetch posts once at the beggining
  fetch_posts(default_posts_url, true);


  $scope.doRefresh = function(data) {
    // TODO: Perhaps, fetch only new posts on pull down and not all
    fetch_posts(default_posts_url, true);  // Clear existing posts from array on refresh
    $scope.load_more_enabled = true;       // Enable loading more posts on infinite-scroll
  }


  var curr_offset = POSTS_PER_PAGE;
  $scope.loadMore = function(data) {

    if ($scope.load_more_enabled) {
      console.log("Current Offset");
      console.log(curr_offset);
      posts_url = get_tumblr_posts_url(curr_offset);

      // Fetch posts after current offset
      fetch_posts(posts_url, false);  // Do not clear existing posts while loading more

      curr_offset += POSTS_PER_PAGE; // Increment current offset by 20 so that next time posts are loaded from 40
    } else {
      // No more posts to show
      // console.log("No more posts");
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  }
})
