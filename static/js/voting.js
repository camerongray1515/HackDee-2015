$(document).ready(function(){
    $("#thumbUp").click(voteUp())
    $("#thumbDown").click(voteDown())
    var video.rank = 0;
});

function voteUp(){
  $.post("/api/vote/",
  {
    up_down="up"
  }
}

function voteDown(){
  $.post("/api/vote/",
  {
    up_down="down"
  }
}
