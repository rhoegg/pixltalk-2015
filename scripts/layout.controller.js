    angular.module("pixltalk2015").controller("LayoutController", function($scope, $timeout) {
      $scope.layout = function() {
      	// bit of a hack here, this needs to run after everyting else
        $timeout(function() {$(document).foundation()}, 50);
      }
    });
