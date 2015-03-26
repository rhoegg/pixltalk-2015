angular.module("pixltalk2015").controller("NavController", function($scope, $location) {
      $scope.nav = {
      	choices: [
      	  {
      		route: "",
      		title: "Welcome"
      	  },
          {
      		route: "rules",
      		title: "Change the Rules"
      	  }
        ]
      }

      $scope.choose = function(route) {
        var entryChoice = $scope.nav.choices[0];
        angular.forEach($scope.nav.choices, function(choice) {
          if (choice.route == route) {
      	    entryChoice = choice;
      	  }
        });
        $scope.nav.current = entryChoice;
      };

      $scope.choose($location.hash);
    });
