var player;
var firstVideoId = '';

function onYouTubeIframeAPIReady() {
	console.log('api ready');
	player = new YT.Player('player', {
		videoId: firstVideoId,
		events: {
			//'onReady': onPlayerReady,
		//	'onStateChange': onPlayerStateChange
		}
	});
}

function loadYoutubeAPI() {
		// 2. This code loads the IFrame Player API code asynchronously.
	 var tag = document.createElement('script');

	 tag.src = "https://www.youtube.com/iframe_api";
	 var firstScriptTag = document.getElementsByTagName('script')[0];
	 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onGoogleLoad() {
	gapi.client.setApiKey('AIzaSyDqnBq55I_HGGdNdyVL94VqrFwLSqy7OqI');
	gapi.client.load('youtube', 'v3', function() {

		var request = gapi.client.youtube.playlistItems.list({
			part: 'snippet',
			playlistId: 'FL5lXztBly8UeivS8M3uQbxA',
			maxResults: 50
		});

		request.execute(function(response) {
			for (var i = 0; i < response.items.length; i++) {
				var snippet = response.items[i].snippet;
				console.log(snippet.resourceId.videoId);

				if (i === 0) {
					firstVideoId = snippet.resourceId.videoId;
					console.log(firstVideoId);
					//player.playVideo(firstVideoId);
				}
			}

			loadYoutubeAPI();
		});
	});
}
