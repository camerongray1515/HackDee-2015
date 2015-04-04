$(document).ready(function(){
	$("#newSubmit").click(add_playlist)
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
		// var table = document.getElementsByTagName("tbody").item(1);
		// var row = document.createElement("tr");
		// var number = document.createElement("td");
		// var name = document.createElement("td");
		// var number_text = document.createTextNode(i.toString());
		// var name_text = array[i]["title"];
		// number.appendChild(number_text);
		// name.appendChild(name_text);
		// row.appendChild(number);
		// row.appendChild(name);
		// table.appendChild(row);

		$("#tab_logic").append('<tr><td>' + )
	}
}