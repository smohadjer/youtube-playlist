'use strict';

class YTPlayer {
	constructor(element) {
		const _this = this;
		this.element = element;
		this.playlistId = this.element.getAttribute('data-playlist-id');
		this.apiKey = this.element.getAttribute('data-api-key');
		this.videoId = this.element.getAttribute('data-video-id');

		if (this.playlistId && this.apiKey) {
			this.fetchPlaylist();
		} else {
			this.element.addEventListener('youtubeIframeApiIsReady', function() {
				console.log('event youtubeIframeApiIsReady fired!');
				_this.showVideo(_this.videoId);
			});
		}

		this.loadYoutubeIframeAPI();
	}

	fetchPlaylist() {
		const _this = this;
		gapi.client.setApiKey(this.apiKey);
		gapi.client.load('youtube', 'v3', function() {
			const request = gapi.client.youtube.playlistItems.list({
				part: 'snippet',
				playlistId: _this.playlistId,
				maxResults: 50
			});

			request.execute(function(response) {
				let videoId;

				for (let i = 0; i < response.items.length; i++) {
					const snippet = response.items[i].snippet;
					//console.log(snippet);
					_this.addItem(snippet);

					if (i === 0) {
						videoId = snippet.resourceId.videoId;
					}
				}

				//display first video in playlist
				_this.showVideo(videoId);
				let li = _this.element.querySelectorAll('.ytplayer-list li')[0];
				_this.updatePlaylist(li);
			});
		});
	}

	updateVideo(li) {
		const videoId = li.getAttribute('data-id');
		this.player.loadVideoById(videoId);
	}

	updatePlaylist(li) {
		const ul = li.parentNode;
		const thumbs = ul.querySelectorAll('li');

		Array.prototype.forEach.call(thumbs, function(el, i){
			el.classList.remove('selected');
		});

		li.classList.add('selected');
	}

	addItem(snippet) {
		const _this = this;
		const ul = this.element.querySelector('.ytplayer-list');
		const thumbnail = snippet.thumbnails.medium.url;
		const videoId = snippet.resourceId.videoId;
		const img = `<img src="${thumbnail}" />`;
		const li = document.createElement('li');

		li.innerHTML = img;
		li.setAttribute('data-id', videoId);
		li.addEventListener('click', function(event) {
			const li = event.target.parentNode;
			_this.updatePlaylist(li);
			_this.updateVideo(li);
		});

		ul.appendChild(li);
	}

	loadYoutubeIframeAPI() {
		const tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		const firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}

	showVideo(videoId) {
		this.player = new YT.Player(this.element.querySelector('.ytplayer-player'), {
			videoId: videoId,
			playerVars: {
				'autoplay': 0,
				'rel': 0,
				'showinfo': 0
			},
			events: {
				//'onReady': onPlayerReady,
				//'onStateChange': onPlayerStateChange
			}
		});
	}
}
