angular.module("pixltalk2015", ["ngRoute"])
	.constant("baseSearchTerm", "pixlfest")
	.config(["$routeProvider",
		function($routeProvider) {
			$routeProvider.
				when("/rules", {
					templateUrl: "partials/changerules.html",
					controller: "ChangeRulesController"
				}).
				otherwise({
					templateUrl: "partials/splash.html"
				});
		}]);
