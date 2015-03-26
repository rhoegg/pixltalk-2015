angular.module("pixltalk2015").factory("twitterService", function($http, baseSearchTerm) {

  return {
  	getLatestTweets: function(sinceId, next) {
      console.log("TwitterService: Getting latest tweets since " + sinceId);
      var url = "http://cors-anywhere.herokuapp.com/http://gentle-beyond-4243.herokuapp.com/1.1/search/tweets.json?q=%23" + baseSearchTerm + "&count=100&include_entities=0&since_id=" + sinceId;
  	  console.log("TwitterService: refreshing with " + url);
      $http.get(url)
        .success(function(data, status, headers, config) {
          next(angular.fromJson(data));
        });
  	},
  	getLatestTweetId: function(next) {
      $http.get("http://cors-anywhere.herokuapp.com/http://gentle-beyond-4243.herokuapp.com/1.1/search/tweets.json?q=%23" + baseSearchTerm + "&count=2&include_entities=0")
  	    .success(function(data, status, headers, config) {
  	      next(angular.fromJson(data).search_metadata.max_id);
  	    });
  	}
  }
});