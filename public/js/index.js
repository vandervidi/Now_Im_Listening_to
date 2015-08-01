var player;
var songsList;
var videoTime = 0;
var currSongPosition = 0;
var timeupdater = null;

$(document).ready(function() {
	//Loading the Youtube iFrame API
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
	
	$.ajax({
		type : "GET",
		url : 'https://nilt.herokuapp.com/getSongsList',
		success : function(data) {
			songsList = data.songs;
			//Load the first song into the player
			player.loadVideoById(songsList[currSongPosition].youtubeVideoId);
			//Update publisher info
			updatePublisherInfo(songsList[currSongPosition].userFacebookPic, songsList[currSongPosition].name);
			//update song title
			updateSongName(songsList[currSongPosition].title);
		},
		error : function(objRequest, errortype) {
			console.log("ERROR:: Could not get list of songs. Error description: ", errortype);
		}
	});

	//buttons listeners

	// //play
	// $('#play').on('click', function() {
// 
	// });

	//previous
	$('#prev').on('click', function() {
		loadPrevVideo();
	});

	//next
	$('#next').on('click', function() {
		loadNextVideo();
	});

	//shuffle and play
	$('#shuffle').on('click', function() {
		//1. shuffle the array
		songsList = shuffleArray(songsList);
		//2. play the first song
		//initialize currnt song position to zero
		currSongPosition = 0;

		//Load the first song into the player
		player.loadVideoById(songsList[currSongPosition].youtubeVideoId);

		//Update publisher info
		updatePublisherInfo(songsList[currSongPosition].userFacebookPic, songsList[currSongPosition].name);

		//update song title
		updateSongName(songsList[currSongPosition].title);

	});
});

function onYouTubePlayerAPIReady() {
	player = new YT.Player('player', {
		height : '390',
		width : '640',
		videoId : '',
		playerVars : {
			'iv_load_policy' : 3,
			'autohide' : 1,
			'controls' : 0,
			'showinfo' : 0
		},
		events : {
			onReady : onPlayerReady,
			onStateChange : onPlayerStateChange
		}
	})
	player.addEventListener("onError", "onError");
}

function onPlayerReady(a) {
	function updateTime() {
		var oldTime = videoTime;
		if (player && player.getCurrentTime) {
			videoTime = player.getCurrentTime();
		}
		if (videoTime !== oldTime) {
			onProgress(videoTime);
		}
	}

	timeupdater = setInterval(updateTime, 100);

	player.playVideo();
	player.setVolume(100);
	player.setPlaybackQuality("hd720");

	//changePublishersPic()
}

// when the time changes in the player, this will be called.
function onProgress(currentTime) {
	// Update the progress bar
	$(".progress-bar").attr("aria-valuenow", currentTime);
	$(".progress-bar").css("width", currentTime * $(".progress").width() / $(".progress-bar").attr("aria-valuemax"));

}

function onError(event){
	if(event.data == 150){
		loadNextVideo();
	}
}

function loadNextVideo() {
	currSongPosition++;
	//If the current song is the last one, start over and play the first  song
	if (currSongPosition > songsList.length - 1) {
		currSongPosition = 0;
	}

	//Update publisher info
	updatePublisherInfo(songsList[currSongPosition].userFacebookPic, songsList[currSongPosition].name);

	//update song title
	updateSongName(songsList[currSongPosition].title);

	if (player) {
		player.loadVideoById(songsList[currSongPosition].youtubeVideoId);
	}
}

function updatePublisherInfo(pic, name) {
	$("#publisherPic").empty().append('<img src=" ' + pic + ' " class="img-circle">');
	$("#publisherName").empty().append(name);
}

function loadPrevVideo() {
	currSongPosition--;
	//If the current song is the last one, start over and play the first  song
	if (currSongPosition < 0) {
		currSongPosition = songsList.length - 1;
	}

	//Update publisher info
	updatePublisherInfo(songsList[currSongPosition].userFacebookPic, songsList[currSongPosition].name);

	//update song title
	updateSongName(songsList[currSongPosition].title);

	//loadInfo(trackInfo[i].id);
	if (player) {
		player.loadVideoById(songsList[currSongPosition].youtubeVideoId);
	}
}

function onPlayerStateChange(event) {
	switch (event.data) {
	case -1:
		//unstarted
		break;
	case 0:
		//ended
		loadNextVideo();
		break;
	case 1:
		//playing
		// set slider max min val
		console.log(event.target.getDuration());
		$(".progress-bar").attr({
			'aria-valuemin' : 0,
			'aria-valuemax' : event.target.getDuration()
		});
		break;
	case 2:
		//pause
		break;
	case 3:
		//baffering
		break;
	case 5:
		//video cued
		break;
	}
}

function stopVideo() {
	player.stopVideo();
}

function updateSongName(title) {
	$("#title").empty().append(title);
}

function shuffleArray(d) {
	for (var c = d.length - 1; c > 0; c--) {
		var b = Math.floor(Math.random() * (c + 1));
		var a = d[c];
		d[c] = d[b];
		d[b] = a
	}
	return d;
}

