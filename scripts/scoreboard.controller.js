angular.module("pixltalk2015").controller("ScoreboardController", function($scope, $interval, rulesService, twitterService) {
  	$scope.scoreboard = {
  		whatToMatch: rulesService.magicWord,
  		champion: "@rhoegg",
  		challenger: "",
  		conferenceTweetCount: 0,
      angularTweetCount: 0,
  		scores: {}
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
          if (rulesService.shouldCount(status.text)) {
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

    twitterService.getLatestTweetId(function(id) {
      $scope.scoreboard.max_id = id;
      console.log("Using latest tweet id: " + $scope.scoreboard.max_id);
    });

  	$interval(function(){
      twitterService.getLatestTweets($scope.scoreboard.max_id, updateScoreboard);
    }, 15000);

    $scope.$watch(function() { return rulesService.magicWord; },
      function(newValue) {
        $scope.scoreboard.whatToMatch = newValue;
      }
    );

  });
