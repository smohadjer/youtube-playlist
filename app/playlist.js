var youtubePlaylist = {
	getPlaylistId: function(list) {
		return list.getAttribute('data-playlist-id');
	},
	getApiKey: function(list) {
		return list.getAttribute('data-api-key');
	},
	init: function() {
		youtubePlaylist.lists = document.querySelectorAll('.youtube-playlist');
		let done = false;

		youtubePlaylist.lists.forEach(function(list, index) {

			gapi.client.setApiKey(youtubePlaylist.getApiKey(list));
			gapi.client.load('youtube', 'v3', function() {
				const request = gapi.client.youtube.playlistItems.list({
					part: 'snippet',
					playlistId: youtubePlaylist.getPlaylistId(list),
					maxResults: 50
				});

				request.execute(function(response) {
					for (let i = 0; i < response.items.length; i++) {
						var snippet = response.items[i].snippet;
						youtubePlaylist.addItem(list, snippet);
					}

					if (!done) {
						done = true;
						youtubePlaylist.loadAPI();
					}
				});
			});
		});
	},
	updateVideo: function(e) {
		const img = e.target;
		const li = img.parentNode;
		const ul = li.parentNode;
		const list = ul.parentNode;
		const thumbs = ul.querySelectorAll('li img');

		Array.prototype.forEach.call(thumbs, function(el, i){
			el.classList.remove('selected');
		});

		img.classList.add('selected');

		const videoId = img.getAttribute('data-id');

		youtubePlaylist.player.loadVideoById(videoId);
	},
	addItem: function(list, snippet) {
		ul = list.querySelector('.youtube-playlist-list');
		const thumbnail = snippet.thumbnails.default.url;
		const videoId = snippet.resourceId.videoId;
		const img = `<img data-id="${videoId}" src="${thumbnail}" />`;
		const li = document.createElement('li');

		li.innerHTML = img;
		li.addEventListener('click', youtubePlaylist.updateVideo);
		ul.appendChild(li);
	},
	loadAPI: function() {
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}
};

gapi.load('client', youtubePlaylist.init);

function onYouTubeIframeAPIReady() {
	youtubePlaylist.lists.forEach(function(list, index) {
		const ul = list.querySelector('.youtube-playlist-list');
		const img = ul.querySelector('li img');
		const videoId = img.getAttribute('data-id');
		img.classList.add('selected');

		youtubePlaylist.player = new YT.Player(list.querySelector('.youtube-playlist-player'), {
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

	});
}

function onPlayerReady(e) {
	//console.log(e);
}

function onPlayerStateChange(e) {
	//console.log(e);
}
