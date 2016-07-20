var currentTime = 1;
var breakTime = 1;
var goal = "something awesome";
var workingTimeSecs = 0;
var breakTimeSecs = 0;
var min;
var intervalHandler = null;
var breakIntervalHandler = null;
var history = [];
var beep = $("#beep");


function convertToMinutes(seconds) {
  return Math.floor(seconds / 60);
}

function timeCustomization() {
  // visual hint for disabled customization cases
  //customizationBtnDisabled();
  
  $(".current-timer .minus-btn").on("click", function(){
    if (!$(this).hasClass("disabled")) {
      if (currentTime > 1) {
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

function displayCurrentWorkTime(forceSubtract) {
  var minutes = convertToMinutes(workingTimeSecs);
  if (workingTimeSecs > 0 || forceSubtract) {
    $("#current-time").text(currentTime - minutes - 1);
  } else {
    $("#current-time").text(currentTime - minutes);
  }
}

function displayCurrentBreakTime() {
  var minutes = convertToMinutes(breakTimeSecs);
  if (breakTimeSecs > 0) {
    $("#break-time").text(breakTime - minutes);
  } else {
    $("#break-time").text(breakTime - minutes);
  }
}

// start a break
function breakStart() {
  if (convertToMinutes(workingTimeSecs) == currentTime) {
    console.log("start");
    $("#break-clock").addClass("animated pulse infinite");
    
    breakIntervalHandler = setInterval(function(){
      breakTimeSecs += 1;
      console.log(breakTimeSecs);
      if (breakTimeSecs % 60 == 0) {
        if (convertToMinutes(breakTimeSecs) == breakTime) {
          clearInterval(breakIntervalHandler);
          $("#break-clock").removeClass("animated pulse infinite");
          $("#break-time").text("0");
          // audio alarm
          beepPlay();
        } else {
          displayCurrentBreakTime();
        }
      }
    }, 1000);
    
  }
  displayCurrentBreakTime();
}


//function displayRefreshClocksOption() {
  //if ((breakTime == convertToMinutes(breakTimeSecs))) {
    //$("#pause-btn").addClass("hidden");
    //$("#refresh-btn").removeClass("hidden");
  //}
//}

// restarting clocks
function refresh() {
  currentTime = 25;
  breakTime = 5;
  goal = "something awesome";
  workingTimeSecs = 0;
  breakTimeSecs = 0;
  intervalHandler = null;
  breakIntervalHandler = null;
  
  $(".add-btn, .minus-btn").removeClass("disabled");
  $("#start-btn").removeClass("hidden");
  $("#pause-btn").addClass("hidden");
  $("#refresh-btn").addClass("hidden");
  $(".current-timer-box").removeClass("blurred");
}

// alarm
function beepPlay() {
  $("#beep").trigger('play');
}

// marking the buttons of customization when disabled to perform minus
function customizationBtnDisabled() {
  if (currentTime <= 1) {
    $(".minus-btn").addClass("disabled"); 
  } else {
    $(".minus-btn").removeClass("disabled"); 
  }
  
  if (breakTime <= 1) {
    $(".minus-btn").addClass("disabled"); 
  } else {
    $(".minus-btn").removeClass("disabled"); 
  }
}


$(document).ready(function() {
  displayCurrentWorkTime();
  $("#break-time").text(breakTime);
  
  // time spans customization
  timeCustomization();
  
 
  // starting countdown of work time
  $("#start-btn").on("click", function() {
    if (breakIntervalHandler == null) {
      intervalHandler = setInterval(function() {
        workingTimeSecs += 1;
        console.log(workingTimeSecs);
        if (workingTimeSecs % 60 == 0) {
          // countdown finished
          if (convertToMinutes(workingTimeSecs) == currentTime) {
            clearInterval(intervalHandler);
            $(".dot").addClass("complete");

            // audio alarm
            beepPlay();
            
            // breaks
            breakStart();
            
            // blur starts
            $(".current-timer-box").addClass("blurred");
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
    } else {
      if ((breakTime - convertToMinutes(breakTimeSecs)) > 0) {
        breakStart();
        $("#start-btn").addClass("hidden");
        $("#pause-btn").removeClass("hidden");
        $("#break-clock").addClass("animated pulse infinite");
      } 
    }
  }); 
  
  $("#pause-btn").on("click", function() {
    if (breakIntervalHandler == null) {
      $(".dot, .pie").removeClass("animating");
      clearInterval(intervalHandler);
      $("#start-btn").removeClass("hidden");
      $("#pause-btn").addClass("hidden");
    } else {
      clearInterval(breakIntervalHandler);
      $("#start-btn").removeClass("hidden");
      $("#pause-btn").addClass("hidden");
      $("#break-clock").removeClass("animated pulse infinite");
    }
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
  
  // reset option 
 // displayRefreshClocksOption();
  
// saving history in local storage
//localStorage.setItem(history, goal);
  
// restart
$("#refresh-btn").on("click", function() {
  refresh();
});
  
});