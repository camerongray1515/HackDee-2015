$(document).ready(function(){
	$("#newSubmit").click(add_playlist);
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
