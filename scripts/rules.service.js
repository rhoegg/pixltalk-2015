function RulesService() {
	this.magicWord = "#angularjs";

	this.shouldCount = function(tweetText) {
  		function escapeRegExp(expression) {
  			return expression.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  		}
		return new RegExp(escapeRegExp(this.magicWord)).test(tweetText);
  	}

}

angular.module("pixltalk2015").service("rulesService", RulesService);