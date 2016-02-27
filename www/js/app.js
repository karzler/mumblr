// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('mumblr', ['ionic', 'mumblr.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if (window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        $ionicPopup.confirm({
                        title: "Internet Disconnected",
                        content: "The internet is disconnected on your device."
                      })
        .then(function(result) {
          if(!result) {
            ionic.Platform.exitApp();
          }
        });
      }
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $interpolateProvider) {

  //$interpolateProvider.startSymbol('[[{');
  //$interpolateProvider.endSymbol(']]}');

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/base.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'mainContent': {
        templateUrl: 'templates/home.html'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'mainContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.posts', {
    url: '/posts',
    views: {
      'mainContent': {
        templateUrl: 'templates/posts.html',
        controller: 'PostsCtrl'
      }
    }
  })

  .state('app.post', {
    url: '/posts/:postId',
    views: {
      'mainContent': {
        templateUrl: 'templates/post.html',
      }
    }
  })


  .state('app.browse', {
    url: '/browse',
    views: {
      'mainContent': {
        templateUrl: 'templates/browse.html'
      }
    }
  })

  .state('app.bookmarks', {
    url: '/bookmarks',
    views: {
      'mainContent': {
        templateUrl: 'templates/bookmarks.html',
        controller: 'BookmarksCtrl'
      }
    }
  })


  // If none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});
