var youtubePlaylist = {
	playlist: document.querySelector('.youtube-playlist'),
	getPlaylistId: function() {
		return this.playlist.getAttribute('data-playlist-id');
	},
	getApiKey: function() {
		return this.playlist.getAttribute('data-api-key');
	},
	updateVideo: function(e) {
		const img = e.target;
		const elements = document.querySelectorAll('.youtube-playlist-list li img');

		Array.prototype.forEach.call(elements, function(el, i){
			el.classList.remove('selected');
		});

		img.classList.add('selected');

		const videoId = img.getAttribute('data-id');
		youtubePlaylist.player.loadVideoById(videoId);
	},
	addItem: function(snippet) {
		const list = document.getElementsByClassName('youtube-playlist-list')[0];
		const thumbnail = snippet.thumbnails.default.url;
		const videoId = snippet.resourceId.videoId;
		const img = `<img data-id="${videoId}" src="${thumbnail}" />`;
		const li = document.createElement('li');

		li.innerHTML = img;
		li.addEventListener('click', youtubePlaylist.updateVideo);
		list.appendChild(li);
	},
	loadAPI: function() {
		 var tag = document.createElement('script');
		 tag.src = "https://www.youtube.com/iframe_api";
		 var firstScriptTag = document.getElementsByTagName('script')[0];
		 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}
};

function onYouTubeIframeAPIReady() {
	const list = youtubePlaylist.playlist.querySelector('.youtube-playlist-list');
	const img = list.querySelector('li img');
	const videoId = img.getAttribute('data-id');

	img.classList.add('selected');

	youtubePlaylist.player = new YT.Player(document.querySelector('.youtube-playlist-player'), {
		videoId: videoId,
		playerVars: {
			'autoplay': 0,
			'rel': 0,
			'showinfo': 0
		},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(e) {
	//console.log(e);
}

function onPlayerStateChange(e) {
	//console.log(e);
}

function onGoogleLoad() {
	gapi.client.setApiKey(youtubePlaylist.getApiKey());
	gapi.client.load('youtube', 'v3', function() {
		const request = gapi.client.youtube.playlistItems.list({
			part: 'snippet',
			playlistId: youtubePlaylist.getPlaylistId(),
			maxResults: 50
		});

		request.execute(function(response) {
			for (var i = 0; i < response.items.length; i++) {
				var snippet = response.items[i].snippet;
				youtubePlaylist.addItem(snippet);
			}

			youtubePlaylist.loadAPI();
		});
	});
}
