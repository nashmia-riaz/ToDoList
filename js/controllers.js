
function escapeEmailAddress(email) {
  if (!email) return false
  // Replace '.' (not allowed in a Firebase key) with ','
  email = email.toLowerCase();
  email = email.replace(/\./g, ',');
  return email.trim();
}
angular.module('starter.controllers', [])
  .controller('SignUpCtrl', [
    '$scope', '$rootScope', '$firebaseAuth', '$window','$state',
    function ($scope, $rootScope, $firebaseAuth, $window, $state) {
      $scope.user = {
        email: "",
        password: ""
      };
      $scope.createUser = function () {
        var email = this.user.email;
        var password = this.user.password;

        if (!email || !password) {
          $rootScope.notify("Please enter valid credentials");
          console.log("NOTHING ENTERED");
          return false;
        }

        $rootScope.show('Please wait.. Registering');
        // $rootScope.auth.$createUserWithEmailAndPassword(email, password, function (error, user) {
        //   if (!error) {
        //     $rootScope.hide();
        //     $rootScope.userEmail = user.email;
        //     $window.location.href = ('#/bucket/list');
        //     console.log("NO ERROR");
        //   }
        //   else {
        //     $rootScope.hide();
        //     if (error.code == 'INVALID_EMAIL') {
        //       $rootScope.notify('Invalid Email Address');
        //       console.log("EMAIL WRONG");
        //     }
        //     else if (error.code == 'EMAIL_TAKEN') {
        //       $rootScope.notify('Email Address already taken');
        //       console.log("EMAIL TAKEN");
        //     }
        //     else {
        //       $rootScope.notify('Oops something went wrong. Please try again later');
        //       console.log("SOMETHING WENT WRONG LIKE MY LIFE");
        //       console.log(error.code);
        //     }
        //   }
        // });

        $rootScope.auth.$createUserWithEmailAndPassword(email, password)
        .then(function(firebaseUser){
          console.log("CREATED");
          $rootScope.hide()
          $window.location.href = ('#/bucket/list');
        })
        .catch(function(error){
          console.log(error);
        });
      };
    }
  ])

  .controller('SignInCtrl', [
  '$scope', '$rootScope', '$firebaseAuth', '$window',
  function ($scope, $rootScope, $firebaseAuth, $window) {
     // check session
    //  $rootScope.checkSession();
     $scope.user = {
        email: "",
        password: ""
     };
     $scope.validateUser = function () {
        $rootScope.show('Please wait.. Authenticating');
        var email = this.user.email;
        var password = this.user.password;
        if (!email || !password) {
           $rootScope.notify("Please enter valid credentials");
           return false;
        }
        $rootScope.auth.$signInWithEmailAndPassword(email,password)
        .then(function (user) {
          $rootScope.hide();
          $rootScope.userEmail = email;
          $window.location.href = ('#/bucket/list');
        }, function (error) {
          $rootScope.hide();
          if (error.code == 'INVALID_EMAIL') {
            $rootScope.notify('Invalid Email Address');
            console.log("WRONG EMAIL");
          }
          else if (error.code == 'INVALID_PASSWORD') {
            $rootScope.notify('Invalid Password');
            console.log("WRONG PASSWORD");
          }
          else if (error.code == 'INVALID_USER') {
            $rootScope.notify('Invalid User');
            console.log("WRONG USER");
          }
          else {
            $rootScope.notify('Oops something went wrong. Please try again later');
            console.log("SUM ERROR");
          }
        });
     };
  }
])
.controller('completedCtrl', function($rootScope, $scope, $window, $firebase) {
  $rootScope.show("Please wait... Processing");
  $scope.list = [];

  var bucketListRef = firebase.database().ref(escapeEmailAddress($rootScope.userEmail)+'/');
  bucketListRef.on('value', function(snapshot) {
    $scope.list = [];
    var data = snapshot.val();

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].isCompleted == true) {
          data[key].key = key;
          $scope.list.push(data[key]);
        }
      }
    }
    if ($scope.list.length == 0) {
      $scope.noData = true;
    } else {
      $scope.noData = false;
    }

    $rootScope.hide();
  });

  $scope.deleteItem = function(key) {
    $rootScope.show("Please wait... Deleting from List");
    var itemRef = firebase.database().ref(escapeEmailAddress($rootScope.userEmail)+'/'+key);
    bucketListRef.child(key).remove(function(error) {
      if (error) {
        $rootScope.hide();
        $rootScope.notify('Oops! something went wrong. Try again later');
      } else {
        $rootScope.hide();
        $rootScope.notify('Successfully deleted');
      }
    });
  };
})
.controller('myListCtrl', function($rootScope, $scope, $window, $ionicModal, $firebase) {
  $rootScope.show("Please wait... Processing");
  $scope.list = [];
  // console.log($rootScope.us);
  // var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
  var bucketListRef = firebase.database().ref(escapeEmailAddress($rootScope.userEmail)+'/');
  bucketListRef.on('value', function(snapshot) {
    var data = snapshot.val();
    console.log(data);
    $scope.list = [];

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].isCompleted == false) {
          data[key].key = key;
          $scope.list.push(data[key]);
        }
      }
    }

    if ($scope.list.length == 0) {
      $scope.noData = true;
    } else {
      $scope.noData = false;
    }
    $rootScope.hide();

  });

  $ionicModal.fromTemplateUrl('templates/newItem.html', function(modal) {
    $scope.newTemplate = modal;
  });

  $scope.newTask = function() {
    $scope.newTemplate.show();
  };

  $scope.markCompleted = function(key) {
    $rootScope.show("Please wait... Updating List");
    // var itemRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail) + '/' + key);
    var itemRef = firebase.database().ref(escapeEmailAddress($rootScope.userEmail)+'/'+key);
    console.log(itemRef);
    itemRef.update({
      isCompleted: true
    }, function(error) {
      if (error) {
        $rootScope.hide();
        $rootScope.notify('Oops! something went wrong. Try again later');
      } else {
        $rootScope.hide();
        $rootScope.notify('Successfully updated');
      }
    });
  };

  $scope.deleteItem = function(key) {
    $rootScope.show("Please wait... Deleting from List");
    var itemRef = firebase.database().ref(escapeEmailAddress($rootScope.userEmail)+'/'+key);
    bucketListRef.child(key).remove(function(error) {
      if (error) {
        $rootScope.hide();
        $rootScope.notify('Oops! something went wrong. Try again later');
      } else {
        $rootScope.hide();
        $rootScope.notify('Successfully deleted');
      }
    });
  };
})

.controller('newCtrl', function($rootScope, $scope, $window, $firebase) {
  $scope.data = {
    item: ""
  };

  $scope.close = function() {
    $scope.modal.hide();
  };

  $scope.createNew = function() {
    var item = this.data.item;

    if (!item) return;

    $scope.modal.hide();
    $rootScope.show();
    $rootScope.show("Please wait... Creating new");

    var form = {
      item: item,
      isCompleted: false,
      created: Date.now(),
      updated: Date.now()
    };

    // var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    // $firebase(bucketListRef).$add(form);
    console.log($rootScope.userEmail);
    console.log(escapeEmailAddress($rootScope.userEmail));
    firebase.database().ref(escapeEmailAddress($rootScope.userEmail)+'/').push().set(form);
    $rootScope.hide();
  };
});
