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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var YTPlayer = function () {
	function YTPlayer(element) {
		_classCallCheck(this, YTPlayer);

		this.element = element;
		this.playlistId = this.element.getAttribute('data-playlist-id');
		this.videoId = this.element.getAttribute('data-video-id');

		if (this.playlistId) {
			this.fetchPlaylist();
		} else {
			this.fetchVideo();
		}
	}

	_createClass(YTPlayer, [{
		key: 'fetchVideo',
		value: function fetchVideo() {
			var _this = this;

			var request = gapi.client.youtube.videos.list({
				part: 'snippet',
				id: this.videoId
			}).then(function (response) {
				var snippet = response.result.items[0].snippet;
				_this.showVideo(_this.videoId);
				_this.updateVideoInfo(snippet.title, snippet.description);
			});
		}
	}, {
		key: 'fetchPlaylist',
		value: function fetchPlaylist() {
			var _this2 = this;

			var request = gapi.client.youtube.playlistItems.list({
				part: 'snippet',
				playlistId: this.playlistId,
				maxResults: 50
			}).then(function (response) {

				var items = response.result.items;
				var videoId = void 0;

				for (var i = 0; i < items.length; i++) {
					var snippet = items[i].snippet;
					_this2.addItem(snippet);
					if (i === 0) {
						videoId = snippet.resourceId.videoId;
					}
				}

				//display first video in playlist
				_this2.showVideo(videoId);
				var li = _this2.element.querySelectorAll('.ytplayer-list li')[0];
				_this2.updatePlaylist(li);
			});
		}
	}, {
		key: 'updateVideo',
		value: function updateVideo(li) {
			var videoId = li.getAttribute('data-id');
			this.player.loadVideoById(videoId);
		}
	}, {
		key: 'updatePlaylist',
		value: function updatePlaylist(li) {
			var ul = li.parentNode;
			var thumbs = ul.querySelectorAll('li');

			Array.prototype.forEach.call(thumbs, function (el, i) {
				el.classList.remove('selected');
			});

			li.classList.add('selected');

			this.updateVideoInfo(li.getAttribute('data-title'), li.getAttribute('data-description'));
		}
	}, {
		key: 'updateVideoInfo',
		value: function updateVideoInfo(title, description) {
			var titleElement = this.element.querySelector('.ytplayer-title');
			var descriptionElement = this.element.querySelector('.ytplayer-description');

			if (titleElement) {
				titleElement.innerHTML = title;
			}

			if (descriptionElement) {
				descriptionElement.innerHTML = description;
			}
		}
	}, {
		key: 'addItem',
		value: function addItem(snippet) {
			var _this3 = this;

			var ul = this.element.querySelector('.ytplayer-list');
			var thumbnail = snippet.thumbnails.medium.url;
			var videoId = snippet.resourceId.videoId;
			var img = '<img src="' + thumbnail + '" />';
			var li = document.createElement('li');

			li.innerHTML = img;
			li.setAttribute('data-id', videoId);
			li.setAttribute('data-title', snippet.title);
			li.setAttribute('data-description', snippet.description);
			li.addEventListener('click', function (event) {
				var li = event.target.parentNode;
				_this3.updatePlaylist(li);
				_this3.updateVideo(li);
			});

			ul.appendChild(li);
		}
	}, {
		key: 'showVideo',
		value: function showVideo(videoId) {
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
	}]);

	return YTPlayer;
}();
//# sourceMappingURL=ytplayer.js.map
