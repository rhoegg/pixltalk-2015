angular.module("pixltalk2015").controller("RulesController", function($scope, rulesService) {
	$scope.rules = {
		magicWord: rulesService.magicWord
	};

	// publish the Magic Word rule to the rulesService
	$scope.$watch(function(scope) { return scope.rules.magicWord; },
		function(newMagicWord) {
			rulesService.magicWord = newMagicWord;
		}
	);
});