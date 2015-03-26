angular.module("pixltalk2015").controller("ScoreboardController", function($scope, $interval, rulesService, twitterService, baseSearchTerm) {
    $scope.info = {
      whatToMatch: rulesService.magicWord,
      baseSearch: "#" + baseSearchTerm
    };
  	$scope.scoreboard = {
  		champion: {user: "rhoegg", score: 0, imageUrl: "images/me-wedding-2012.png"},
  		conferenceTweetCount: 0,
      matchedTweetCount: 0,
  		scores: {}
  	};

  	function updateScoreboard(twitterResults) {
  		if (twitterResults.statuses.length > 0) {
  			console.log("processing " + twitterResults.search_metadata.count + " tweets, latest: " + twitterResults.statuses[0].text);
          	scoreTweets(twitterResults.statuses);
          	
            $scope.scoreboard.max_id = twitterResults.search_metadata.max_id;
          	
            var context = { max: 0, winner: $scope.scoreboard.champion };
          	angular.forEach($scope.scoreboard.scores, function(score, user) {
          		if (score.points > this.max) {
          			this.max = score.points;
          			this.winner = { user: user, score: score.points, imageUrl: score.imageUrl };
          		}
          	}, context);
          	$scope.scoreboard.champion = context.winner;
  		}
  	}

  	function scoreTweets(tweets) {
	    var seekingFirst = true;
    	angular.forEach(tweets, function(status, index) {
    		if (status.id > $scope.scoreboard.max_id) {
    			$scope.scoreboard.conferenceTweetCount += 1;
          if (rulesService.shouldCount(status.text)) {
            $scope.scoreboard.matchedTweetCount += 1;
            var score = $scope.scoreboard.scores[status.user.screen_name] || {
              points: 0,
              imageUrl: status.user.profile_image_url
            };
            rulesService.score(status.text, function(points) {
              score.points = score.points + points;
              $scope.scoreboard.scores[status.user.screen_name] = score;
              if (seekingFirst) { // first match is the most recent
                seekingFirst = false;
                $scope.scoreboard.newestTweet = status.text;
                $scope.scoreboard.challenger = { user: status.user.screen_name, score: score.points, imageUrl: score.imageUrl };
              }
            });
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
        $scope.info.whatToMatch = newValue;
      }
    );

  });
