// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','firebase', 'starter.controllers'])

.run(function($ionicPlatform, $rootScope, $firebaseAuth, $firebase, $window, $ionicLoading) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $rootScope.userEmail = null;

    var config = {
      apiKey: " AIzaSyCivCsDdezs4DZAG0uU0LxvpyaE0KCCG9o",
      authDomain: "ionic-efcc7.firebaseapp.com",
      databaseURL: "https://ionic-efcc7.firebaseio.com/"
    };

    firebase.initializeApp(config);
    $rootScope.auth = $firebaseAuth();
    console.log("rootscope auth");
    console.log($rootScope.auth);
  });


      $rootScope.show = function(text) {
        $rootScope.loading = $ionicLoading.show({
            content: text ? text : 'Loading...',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
      };

      $rootScope.hide = function() {
        $ionicLoading.hide();
      };

      $rootScope.notify = function(text) {
        $rootScope.show(text);
        $window.setTimeout(function() {
          $rootScope.hide();
        }, 1999);
      };

      $rootScope.logout = function() {
        $rootScope.auth.$signOut();
        $rootScope.checkSession();
      };



      $rootScope.checkSession = function() {
      //   var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
      //     if (error) {
      //       // no action yet.. redirect to default route
      //       $rootScope.userEmail = null;
      //       $window.location.href = '#/auth/signin';
      //     } else if (user) {
      //       // user authenticated with Firebase
      //       $rootScope.userEmail = user.email;
      //       $window.location.href = ('#/bucket/list');
      //     } else {
      //       // user is logged out
      //       $rootScope.userEmail = null;
      //       $window.location.href = '#/auth/signin';
      //     }
      //   });

        var user = firebase.auth().currentUser;
        if(user){
            // user authenticated with Firebase
            $rootScope.userEmail = user.email;
            $window.location.href = ('#/bucket/list');
        }
        else{
            // no action yet.. redirect to default route
            $rootScope.userEmail = null;
            $window.location.href = '#/auth/signin';
        }
      };

      // $rootScope.checkSession();
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('auth', {
      url: "/auth",
      abstract: true,
      templateUrl: "templates/auth.html"
    })
    .state('auth.signin', {
      url: '/signin',
      views: {
        'auth-signin': {
          templateUrl: 'templates/auth-signin.html',
          controller: 'SignInCtrl'
        }
      }
    })
    .state('auth.signup', {
      url: '/signup',
      views: {
        'auth-signup': {
          templateUrl: 'templates/auth-signup.html',
          controller: 'SignUpCtrl'
        }
      }
    })
    .state('bucket', {
      url: "/bucket",
      abstract: true,
      templateUrl: "templates/bucket.html"
    })
    .state('bucket.list', {
      url: '/list',
      views: {
        'bucket-list': {
          templateUrl: 'templates/bucket-list.html',
          controller: 'myListCtrl'
        }
      }
    })
    .state('bucket.completed', {
      url: '/completed',
      views: {
        'bucket-completed': {
          templateUrl: 'templates/bucket-completed.html',
          controller: 'completedCtrl'
        }
      }
    })
    $urlRouterProvider.otherwise('/auth/signin');
});
