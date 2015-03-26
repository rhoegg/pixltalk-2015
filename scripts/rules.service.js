function RulesService() {
	this.magicWord = "#angularjs";
	this.exclamationPointBonus = "none";

	this.shouldCount = function(tweetText) {
  		function escapeRegExp(expression) {
  			return expression.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  		}
		return new RegExp(escapeRegExp(this.magicWord)).test(tweetText);
  	};

  	this.score = function(tweetText, next) {
  		var score = 1; // 1 point for the tweet
  		switch(this.exclamationPointBonus) {
  			case "one":
  				if (/!/.test(tweetText)) {
  					score += 1;
  				}
  				break;
  			case "each":
  				score += (tweetText.match(/!/g) || []).length;
  				break;
  			default:
  		}
  		next(score);
  	};
}

angular.module("pixltalk2015").service("rulesService", RulesService);