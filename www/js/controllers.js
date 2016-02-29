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

angular.module('mumblr.controllers', ['ionic','ngCordova'])

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // $scope.$on('$ionicView.enter', function(e) {
  // });


.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {


})


.controller('HomeCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

  // $ionicSlideBoxDelegate.update();
  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }

})

.controller('PostsCtrl', function($scope, $http, $sce, $cordovaToast) {

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
            showToast("No more posts to show" ,'short', 'bottom');
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

  var showToast = function(message, duration, location) {
        $cordovaToast.show(message, duration, location).then(function(success) {
            console.log("The toast was shown");
        }, function (error) {
            console.log("The toast was not shown due to " + error);
        });
    }

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
