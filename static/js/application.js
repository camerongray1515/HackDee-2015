$(document).ready(function(){
	$("#create_playlist_form").submit(add_playlist);
	$("#join_playlist_form").submit(join_playlist);
	$("#search-results-table").on("click", ".btn-add-to-playlist", submitVideo);
});

function add_playlist(){
	$.post("/api/create_playlist/",
	{
		name: $("#playlistname").val()
	},
	function(data){
		if (data["error"]) {
			alert(data["error"]);
			console.log("Error.");
		}
		else {
			window.location.replace("/" + data["playlist_id"] + "/");
			console.log(data["playlist_id"]);
		}
	});
}

function submitVideo() {
	$.post("/api/add_video/", {
		'playlist_id': $(this).attr('data-playlist-id'),
		'slug': $(this).attr('data-video-id'),
		'thumbnail_url': $(this).attr('data-thumbnail-url'),
		'title': $(this).attr('data-video-title')
	}, function(response) {
		console.log(response);
	});

	
}

function update_playlist(){
	$("#video_list").html(""); // Clear list out before we add new entries

	for (var i = 0; i < playlist.length; i++){

		template = $("#playlist-entry-template").html();
        template = template.replace(/\[\[thumbnail_url\]\]/g, playlist[i]['thumbnail_url']);
        template = template.replace(/\[\[video_id\]\]/g, playlist[i]['slug']);
        template = template.replace(/\[\[video_title\]\]/g, playlist[i]['title']);
        template = template.replace(/\[\[rank\]\]/g, playlist[i]['rank']);
        $("#video_list").append(template);
	}
}

function load_playlist() {
	$.get("/api/get_playlist/", {
		'playlist_id': $('#playlist-id').val()
	}, function(data) {
		playlist = data['playlist'];
		update_playlist();
	});
}

function join_playlist(){
	var playlist = $("#pcode").val();
	console.log(playlist);
	window.location.replace("/" + playlist + "/");
	return false;
}

function get_next_video(){
	var slug = false;
	var max = -999; // Todo: Fix this
	for (var i = 0; i < playlist.length; i++){
		if (playlist[i]["rank"].toString() > max){
			max = playlist[i]["rank"];
			slug = playlist[i]["slug"];
		}
	}

	// Mark the video as played if there was a video found and make,
	// sure that the player is visible, else hide the player and
	// show the no video alert
	if (slug) {
		videos.videoPlayed(slug);
		ui.transitionToPlayer();
		videos.playing = true;
	} else {
		videos.playing = false;
		ui.transitionToNoVideoNotice();
	}

	return slug;

}
