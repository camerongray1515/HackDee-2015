$(document).ready(function(){
	$("#newSubmit").click(add_playlist)
});

function add_playlist(){
	$.post("/api/create_playlist/",
	{
		name: $("#playlistname").val()
	},
	function(data){
		if data["error"] {
			alert(data["error"]);
			console.log("Error.");
		}
		else {
			window.location.replace("/".concat(data["playlist_id"]));
			console.log(data["playlist_id"]);
		}
	});
}
