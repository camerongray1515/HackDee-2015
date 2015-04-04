$(document).ready(function(){
	$("#newSubmit").click(add_playlist);
	$("joinSubmit").click(join_playlist);
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

function pull_videos(){
	var array = new Array({"playlist_id": "aLMU_84BLLM",
			  		       "slug": "aLMU_84BLLM",
			  		       "thumbnail_url": "http://img.photobucket.com/albums/v233/thelittleredone/neds.jpg",
			  		       "title": "DJ BAD BOI YA BAS 2K15"});

	for (var i = 0; i < array.length; i++){

		template = $("#videos").html();
        template = template.replace(/\[\[thumbnail_url\]\]/g, array[i]['thumbnail_url']);
        template = template.replace(/\[\[video_id\]\]/g, array[i]['playlist_id']);
        template = template.replace(/\[\[video_title\]\]/g, array[i]['title']);
        $("#video_list").append(template);
	}
}

function join_playlist(){
	var playlist = ("#pcode").val();
	window.location.replace("/" + playlist + "/");
}