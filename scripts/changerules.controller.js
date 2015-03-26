angular.module("pixltalk2015").controller("ChangeRulesController", function($scope, rulesService) {
	$scope.rules = {
		magicWord: rulesService.magicWord,
		exclamationBonus: rulesService.exclamationPointBonus
	};

	$scope.exclamationBonusButton = function(bonus) {
		if ($scope.rules.exclamationBonus == bonus) {
			return "";
		}
		return "secondary";
	}

	$scope.setExclamationBonus = function(bonus) {
		$scope.rules.exclamationBonus = bonus;
	}

	// publish the Magic Word rule to the rulesService
	$scope.$watch(function(scope) { return scope.rules.magicWord; },
		function(newMagicWord) {
			rulesService.magicWord = newMagicWord;
		}
	);

	// publish the Exclamation Point Bonus to the rulesService
	$scope.$watch(function(scope) { return scope.rules.exclamationBonus; },
		function(newBonus) {
			rulesService.exclamationPointBonus = newBonus;
		}
	);
});