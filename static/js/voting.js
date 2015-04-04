$(document).ready(function(){
    $("#thumbUp").click(voteUp())
    $("#thumbDown").click(voteDown())
});

function voteUp(){
  $.post("/api/vote/",
  {

  }
}

function voteDown(){
  $.post("/api/vote/",
  {

  }
}
