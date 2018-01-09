var youtubePlaylist = {
	getPlaylistId: function(list) {
		return list.getAttribute('data-playlist-id');
	},
	getApiKey: function(list) {
		return list.getAttribute('data-api-key');
	},
	init: function() {
		youtubePlaylist.lists = document.querySelectorAll('.ytplayer');

		//load playlists
		youtubePlaylist.lists.forEach(function(list, index) {
			let playlistId = youtubePlaylist.getPlaylistId(list);

			if (playlistId) {
				gapi.client.setApiKey(youtubePlaylist.getApiKey(list));
				gapi.client.load('youtube', 'v3', function() {
					const request = gapi.client.youtube.playlistItems.list({
						part: 'snippet',
						playlistId: playlistId,
						maxResults: 50
					});

					request.execute(function(response) {
						let firstPlaylistItem;

						for (let i = 0; i < response.items.length; i++) {
							var snippet = response.items[i].snippet;
							youtubePlaylist.addItem(list, snippet);

							if (i === 0) {
								videoId = snippet.resourceId.videoId;
							}
						}

						//display first video in playlist
						youtubePlaylist.showVideo(list, videoId);
						let li = list.querySelectorAll('.ytplayer-list li')[0];
						youtubePlaylist.updatePlaylist(li);
					});
				});
			}
		});

		youtubePlaylist.loadAPI();
	},
	updateVideo: function(li) {
		const videoId = li.getAttribute('data-id');
		youtubePlaylist.player.loadVideoById(videoId);
	},
	updatePlaylist: function(li) {
		const ul = li.parentNode;
		const thumbs = ul.querySelectorAll('li');

		Array.prototype.forEach.call(thumbs, function(el, i){
			el.classList.remove('selected');
		});

		li.classList.add('selected');
	},
	addItem: function(list, snippet) {
		ul = list.querySelector('.ytplayer-list');
		const thumbnail = snippet.thumbnails.default.url;
		const videoId = snippet.resourceId.videoId;
		const img = `<img src="${thumbnail}" />`;
		const li = document.createElement('li');

		li.innerHTML = img;
		li.setAttribute('data-id', videoId);
		li.addEventListener('click', function(e) {
			const li = e.target.parentNode;
			youtubePlaylist.updatePlaylist(li);
			youtubePlaylist.updateVideo(li);
		});

		ul.appendChild(li);
	},
	loadAPI: function() {
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	},
	showVideo: function(list, videoId) {
		youtubePlaylist.player = new YT.Player(list.querySelector('.ytplayer-player'), {
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
};

gapi.load('client', youtubePlaylist.init);

function onYouTubeIframeAPIReady() {
	console.log('onYouTubeIframeAPIReady');

	youtubePlaylist.lists.forEach(function(list, index) {
		let playlistId = youtubePlaylist.getPlaylistId(list);
		let videoId = list.getAttribute('data-video-id')

		if (videoId) {
			youtubePlaylist.showVideo(list, videoId);
		}
	});
}

function onPlayerReady(e) {
	//console.log(e);
}

function onPlayerStateChange(e) {
	//console.log(e);
}
