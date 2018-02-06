/*
 * @name          ytplayer.js
 * @version       1.0.1
 * @lastmodified  2018-02-06
 * @author        Saeid Mohadjer
 * @repo		  https://github.com/smohadjer/youtube-playlist
 *
 * Licensed under the MIT License
 */

'use strict';

class YTPlayer {
	constructor(element) {
		this.element = element;
		this.playlistId = this.element.getAttribute('data-playlist-id');
		this.videoId = this.element.getAttribute('data-video-id');

		if (this.playlistId) {
			this.fetchPlaylist();
		} else {
			this.fetchVideo();
		}
	}

	fetchVideo() {
		const request = gapi.client.youtube.videos.list({
			part: 'snippet',
			id: this.videoId
		}).then((response) => {
			const snippet = response.result.items[0].snippet;
			this.showVideo(this.videoId);
			this.updateVideoInfo(snippet.title, snippet.description);
		});
	}

	fetchPlaylist() {
		const request = gapi.client.youtube.playlistItems.list({
			part: 'snippet',
			playlistId: this.playlistId,
			maxResults: 50
		}).then((response) => {

			let items = response.result.items;
			let videoId;

			for (let i = 0; i < items.length; i++) {
				const snippet = items[i].snippet;
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

		this.updateVideoInfo(li.getAttribute('data-title'), li.getAttribute('data-description'));
	}

	updateVideoInfo(title, description) {
		const titleElement = this.element.querySelector('.ytplayer-title');
		const descriptionElement = this.element.querySelector('.ytplayer-description');

		if (titleElement) {
			titleElement.innerHTML = title;
		}

		if (descriptionElement) {
			descriptionElement.innerHTML = description;
		}
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
