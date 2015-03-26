const baseSearchTerm = "javascript";

angular.module("pixltalk2015").controller("ScoreboardController", function($scope, $interval, $http, rulesService) {
  	$scope.scoreboard = {
  		whatToMatch: rulesService.magicWord,
  		champion: "@rhoegg",
  		challenger: "",
  		conferenceTweetCount: 0,
        angularTweetCount: 0,
  		newestTweet: "Fell asleep for a few minutes listening to @rhoegg talk about #angularjs at #pixlfest",
  		scores: {}
  	};

  	$scope.getLatestTweets = function() {
  		var url = "http://cors-anywhere.herokuapp.com/http://gentle-beyond-4243.herokuapp.com/1.1/search/tweets.json?q=%23" + baseSearchTerm + "&count=100&include_entities=0&since_id=" + $scope.scoreboard.max_id;
  		console.log("refreshing with " + url);
        $http.get(url)
          .success(function(data, status, headers, config) {
          	updateScoreboard(angular.fromJson(data));
          });
  	};

  	function updateScoreboard(twitterResults) {
  		if (twitterResults.statuses.length > 0) {
  			console.log("processing " + twitterResults.search_metadata.count + " tweets, latest: " + twitterResults.statuses[0].text);
          	scoreTweets(twitterResults.statuses);
          	
            $scope.scoreboard.max_id = twitterResults.search_metadata.max_id;
          	
            var context = { max: 0, winner: "rhoegg" };
          	angular.forEach($scope.scoreboard.scores, function(score, user) {
          		if (score.tweets > this.max) {
          			this.max = score.tweets;
          			this.winner = user;
          		}
          	}, context);
          	$scope.scoreboard.champion = "@" + context.winner;
  		}
  	}

  	function scoreTweets(tweets) {
	    var seekingFirst = true;
    	angular.forEach(tweets, function(status, index) {
    		if (status.id > $scope.scoreboard.max_id) {
    			$scope.scoreboard.conferenceTweetCount += 1;
          if (shouldCount(status.text)) {
            if (seekingFirst) { // first match is the most recent
              seekingFirst = false;
              $scope.scoreboard.newestTweet = status.text;
              $scope.scoreboard.challenger = "@" + status.user.screen_name;
            }
            $scope.scoreboard.angularTweetCount += 1;
            var score = $scope.scoreboard.scores[status.user.screen_name] || {
              tweets: 0
            };
            score.tweets = score.tweets + 1;
            $scope.scoreboard.scores[status.user.screen_name] = score;
          }
    		} else {
    			console.log("funny, got an old one: " + status.text);
    		}
    	});
    	seekingFirst = true;
  	}

  	function shouldCount(tweetText) {
  		function escapeRegExp(expression) {
  			return expression.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  		}
		  return new RegExp(escapeRegExp($scope.scoreboard.whatToMatch)).test(tweetText);
  	}

  	$http.get("http://cors-anywhere.herokuapp.com/http://gentle-beyond-4243.herokuapp.com/1.1/search/tweets.json?q=%23" + baseSearchTerm + "&count=3&include_entities=0")
  		.success(function(data, status, headers, config) {
  			var result = angular.fromJson(data);
  			$scope.scoreboard.max_id = result.search_metadata.max_id;
  		});
  	$interval(function(){ $scope.getLatestTweets(); }, 15000);

    $scope.$watch(function() { return rulesService.magicWord; },
      function(newValue) {
        $scope.scoreboard.whatToMatch = newValue;
      }
    );
  });
