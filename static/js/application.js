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
        template = template.replace(/\[\[video_id\]\]/g, playlist[i]['playlist_id']);
        template = template.replace(/\[\[video_title\]\]/g, playlist[i]['title']);
        $("#video_list").append(template);
	}
}

function join_playlist(){
	var playlist = $("#pcode").val();
	console.log(playlist);
	window.location.replace("/" + playlist + "/");
	return false;
}

function get_highest_ranked_video(){
	var slug = "";
	var max = -999;
	for (var i = 0; i < playlist.length; i++){
		if (playlist[i]["rank"].toString() > max && playlist[i]["played"] == false){
			max = playlist[i]["rank"];
			slug = playlist[i]["slug"];
		}
	}
	return slug;

}
