var currentTime = 25;
var breakTime = 5;
var goal = "something awesome";
var workingTimeSecs = 0;
var min;
var intervalHandler = null;


function displayCurrentWorkTime(forceSubtract) {
  var minutes = convertToMinutes(workingTimeSecs);
  if (workingTimeSecs > 0 || forceSubtract) {
    $("#current-time").text(currentTime - minutes - 1);
  } else {
    $("#current-time").text(currentTime - minutes);
  }
}

function convertToMinutes(seconds) {
  return Math.floor(seconds / 60);
}

function timeCustomization() {
  $(".current-timer .minus-btn").on("click", function(){
    if (!$(this).hasClass("disabled")) {
      if (currentTime > 0) {
        currentTime -= 1
      }
      displayCurrentWorkTime();
    }
  });
  $(".current-timer .add-btn").on("click", function(){
    if (!$(this).hasClass("disabled")) {
      currentTime += 1;
      displayCurrentWorkTime();
    }
  });
  $(".future-timer .minus-btn").on("click", function(){
    if (!$(this).hasClass("disabled")) {
      if (breakTime > 0) {
      breakTime -= 1;
      }
      $("#break-time").text(breakTime);  
    }
  });
  $(".future-timer .add-btn").on("click", function(){
    if (!$(this).hasClass("disabled")) {
      breakTime += 1;
      $("#break-time").text(breakTime);
    }
  });
}

$(document).ready(function() {
  displayCurrentWorkTime();
  $("#break-time").text(breakTime);
  
  // time spans customization
  timeCustomization();
  
  // starting countdown of work time
  $("#start-btn").on("click", function() {
    intervalHandler = setInterval(function() {
      workingTimeSecs += 1;
      console.log(workingTimeSecs);
      if (workingTimeSecs % 60 == 0) {
        // countdown finished
        if (convertToMinutes(workingTimeSecs) == currentTime) {
          clearInterval(intervalHandler);
          $(".dot").addClass("complete");
        } else {
          displayCurrentWorkTime();
        }
      }
    }, 1000);
    displayCurrentWorkTime(true);
    $(".dot, .pie").addClass("animating").css("animation-iteration-count", currentTime);
    $("#start-btn").addClass("hidden");
    $("#pause-btn").removeClass("hidden");
    $(".add-btn, .minus-btn").addClass("disabled");
  });
  
  $("#pause-btn").on("click", function() {
    $(".dot, .pie").removeClass("animating");
    clearInterval(intervalHandler);
    $("#start-btn").removeClass("hidden");
    $("#pause-btn").addClass("hidden");
  });
  
  // saving the goal
  $("#goal").on("keyup change", function() {
     goal = $("#goal").val();
  });
  
  // set up for tweets
  $("#tweet").on("click", function(e){
    workingTime = convertToMinutes(workingTimeSecs);
    if (workingTime > 1 || workingTime == 0) {
      min = "minutes";
    } else {
      min = "minute";
    }  
    
    var progress = "I've just worked " + workingTime + " " + min + " on " + goal;
    var twtProgress = "https://twitter.com/intent/tweet?hashtags=pomodoro&related=thedoerdoes&text=" + encodeURIComponent(progress);
    window.open(twtProgress, '_blank');
    e.preventDefault();
 });
 
});