'use strict';

class YTPlayer {
	constructor(element) {
		this.element = element;
		this.playlistId = this.element.getAttribute('data-playlist-id');
		this.videoId = this.element.getAttribute('data-video-id');

		if (this.playlistId) {
			this.fetchPlaylist();
		} else {
			this.showVideo(this.videoId);
		}
	}

	fetchPlaylist() {
		gapi.client.load('youtube', 'v3', () => {
			const request = gapi.client.youtube.playlistItems.list({
				part: 'snippet',
				playlistId: this.playlistId,
				maxResults: 50
			});

			request.execute((response) => {
				let videoId;

				for (let i = 0; i < response.items.length; i++) {
					const snippet = response.items[i].snippet;
					//console.log(snippet);
					this.addItem(snippet);

					if (i === 0) {
						videoId = snippet.resourceId.videoId;
					}
				}

				//display first video in playlist
				this.showVideo(videoId);
				let li = this.element.querySelectorAll('.ytplayer-list li')[0];
				this.updatePlaylist(li);
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
		const title = this.element.querySelector('.ytplayer-title');
		const description = this.element.querySelector('.ytplayer-description');

		if (title) {
			title.innerHTML = li.getAttribute('data-title');
		}

		if (description) {
			description.innerHTML = li.getAttribute('data-description');
		}

		Array.prototype.forEach.call(thumbs, function(el, i){
			el.classList.remove('selected');
		});

		li.classList.add('selected');
	}

	addItem(snippet) {
		const ul = this.element.querySelector('.ytplayer-list');
		const thumbnail = snippet.thumbnails.medium.url;
		const videoId = snippet.resourceId.videoId;
		const img = `<img src="${thumbnail}" />`;
		const li = document.createElement('li');

		li.innerHTML = img;
		li.setAttribute('data-id', videoId);
		li.setAttribute('data-title', snippet.title);
		li.setAttribute('data-description', snippet.description);
		li.addEventListener('click', (event) => {
			const li = event.target.parentNode;
			this.updatePlaylist(li);
			this.updateVideo(li);
		});

		ul.appendChild(li);
	}

	showVideo(videoId) {
		this.player = new YT.Player(this.element.querySelector('.ytplayer-video'), {
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
