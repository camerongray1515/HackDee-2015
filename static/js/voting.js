$(document).ready(function(){
    $("#thumbUp").click(voteUp(up_down))
    $("#thumbDown").click(voteDown(up_down))
});

function voteUp(up_down){
  $.post("/api/vote/",
  {
    up_down="up"
    console.log(data["up_down"]);
  }
}

function voteDown(up_down){
  $.post("/api/vote/",
  {
    up_down="down"
    console.log(data["up_down"]);
  }
}
