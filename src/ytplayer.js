/*
 * @name          ytplayer.js
 * @version       1.1.0
 * @lastmodified  2018-02-06
 * @author        Saeid Mohadjer
 * @repo		  https://github.com/smohadjer/youtube-playlist
 *
 * Licensed under the MIT License
 */

'use strict';

export default class YTPlayer {
	constructor(options) {
		this.element = options.element;
		this.cb_playlist_click = options.cb_playlist_click;
		this.cb_init = options.cb_init;
		this.playlistId = this.element.getAttribute('data-playlist-id');
		this.videoId = this.element.getAttribute('data-video-id');

		if (this.playlistId) {
			this.fetchPlaylist();
		} else {
			this.fetchVideo();
		}
	}

	fetchVideo() {
		/*global gapi*/
		gapi.client.youtube.videos.list({
			part: 'snippet',
			id: this.videoId
		}).then((response) => {
			const snippet = response.result.items[0].snippet;
			this.showVideo(this.videoId);
			this.updateVideoInfo(snippet.title, snippet.description);
			if (typeof this.cb_init === 'function') {
				this.cb_init();
			}
		});
	}

	fetchPlaylist() {
		gapi.client.youtube.playlistItems.list({
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
			if (typeof this.cb_init === 'function') {
				this.cb_init();
			}
		});
	}

	updateVideo(li) {
		const videoId = li.getAttribute('data-id');
		this.player.loadVideoById(videoId);
	}

	updatePlaylist(li) {
		const ul = li.parentNode;
		const thumbs = ul.querySelectorAll('li');

		Array.prototype.forEach.call(thumbs, function(el){
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

			if (typeof this.cb_playlist_click === 'function') {
				this.cb_playlist_click(li);
			}
		});

		ul.appendChild(li);
	}

	showVideo(videoId) {
		/*global YT*/
		this.player = new YT.Player(this.element.querySelector('.ytplayer-video'), {
			videoId: videoId,
			playerVars: {
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
