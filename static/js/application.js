$(document).ready(function(){
	$("#video_submit").click(add_playlist)
});

function add_playlist(){
	$.post("/api/create_playlist/",
	{
		name: $("#playlistname").val()
	});
}
