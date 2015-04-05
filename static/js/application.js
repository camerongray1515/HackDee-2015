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

function pull_videos(){
	var array = new Array({"playlist_id": "MaJnd",
			  		       "slug": "aLMU_84BLLM",
			  		       "thumbnail_url": "http://img.photobucket.com/albums/v233/thelittleredone/neds.jpg",
			  		       "title": "DJ BAD BOI YA BAS 2K15",
			  		   	   "rank": 17},
			  		   	   {"playlist_id": "MaJnd",
			  		   	    "slug": "rPRkYWVinF0",
			  		   	    "thumbnail_url": "http://i.ytimg.com/vi/rPRkYWVinF0/hqdefault.jpg",
			  		   	    "title": "Chase & Status",
			  		   	    "rank": 1700});

	for (var i = 0; i < array.length; i++){

		template = $("#videos").html();
        template = template.replace(/\[\[thumbnail_url\]\]/g, array[i]['thumbnail_url']);
        template = template.replace(/\[\[video_id\]\]/g, array[i]['playlist_id']);
        template = template.replace(/\[\[video_title\]\]/g, array[i]['title']);
        $("#video_list").append(template);
	}
}

function join_playlist(){
	var playlist = $("#pcode").val();
	console.log(playlist);
	window.location.replace("/" + playlist + "/");
	return false;
}

function get_highest_rank(array){
	var slug = "";
	var max = -999;
	for (var i = 0; i < array.length; i++){
		if (array[i]["rank"].toString() > max && array[i]["played"] == false){
			max = array[i]["rank"];
			slug = array[i]["slug"];
		}
	}
	return slug;

}
