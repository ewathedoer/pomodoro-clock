var currentTime = 25;
var breakTime = 5;
var goal = "something awesome";
var workingTimeSecs = 0;
var breakTimeSecs = 0;
var min;
var intervalHandler = null;
var breakIntervalHandler = null;
var pomodoroHistory = [];


function convertToMinutes(seconds) {
  return Math.floor(seconds / 60);
}

function timeCustomization() {
  $(".current-timer .minus-btn").on("click", function(){
    if (!$(this).hasClass("disabled")) {
      if (currentTime > 1) {
        currentTime -= 1;
      }
      // visual hint for disabled customization cases
      customizationBtnDisabled();
      
      displayCurrentWorkTime();
    }
  });
  $(".current-timer .add-btn").on("click", function(){
    if (!$(this).hasClass("disabled")) {
      currentTime += 1;
      // visual hint for disabled customization cases
      customizationBtnDisabled();
      
      displayCurrentWorkTime();
    }
  });
  $(".future-timer .minus-btn").on("click", function(){
    if (!$(this).hasClass("disabled")) {
      if (breakTime > 0) {
        breakTime -= 1;
      }
      // visual hint for disabled customization cases
      customizationBtnDisabled();
    
      displayCurrentBreakTime();  
    }
  });
  $(".future-timer .add-btn").on("click", function(){
    if (!$(this).hasClass("disabled")) {
      breakTime += 1;
      displayCurrentBreakTime();
    }
      // visual hint for disabled customization cases
      customizationBtnDisabled();
  });
}

function displayCurrentWorkTime(forceSubtractWhenPlay) {
  var minutes = convertToMinutes(workingTimeSecs);
  if (workingTimeSecs > 0 || forceSubtractWhenPlay) {
    $("#current-time").text(currentTime - minutes - 1);
  } else {
    $("#current-time").text(currentTime - minutes);
  }
}

function displayCurrentBreakTime() {
  $("#break-time").text(breakTime - convertToMinutes(breakTimeSecs));
}

// start a break
function breakStart() {
  if (convertToMinutes(workingTimeSecs) == currentTime) {
    console.log("start");
    
    if (breakTime == 0) {
      // add pomodoro history 
      saveToStorage(new Date(), goal, currentTime);
      
      setTimeout(function() {
        // audio alarm
        beepPlay();
      }, 1500);
      
      // reset option 
      displayRefreshClocksOption();
      
    } else {
      $("#break-clock").addClass("animated pulse infinite");
    
      breakIntervalHandler = setInterval(function(){
        breakTimeSecs += 1;
        console.log(breakTimeSecs);
        if (breakTimeSecs % 60 == 0) {
          if (convertToMinutes(breakTimeSecs) == breakTime) {
            clearInterval(breakIntervalHandler);
            $("#break-clock").removeClass("animated pulse infinite");
            $("#break-time").text("0");
            
            // add pomodoro history 
            saveToStorage(new Date(), goal, currentTime);
            
            // audio alarm
            beepPlay();

            // reset option 
            displayRefreshClocksOption();
          } else {
            displayCurrentBreakTime();
          }
        }
      }, 1000);
    }
  }
  displayCurrentBreakTime();
}

function displayRefreshClocksOption() {
  if ((breakTime == convertToMinutes(breakTimeSecs))) {
    $("#pause-btn").addClass("hidden");
    $("#refresh-btn").removeClass("hidden");
    $(".future-timer").addClass("blurred");
  }
}

// restarting clocks
function refresh() {
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
  $(".future-timer").removeClass("blurred");
  $(".pie, .dot").removeClass("animating");
  
  $("#left .pie, #right .pie, .dot").removeClass("animated");
  setTimeout(function() {
    $(".dot").removeClass("complete");
    $("#left .pie, #right .pie, .dot").addClass("animated");
  }, 500);
  
  customizationBtnDisabled();
  displayCurrentWorkTime();
  displayCurrentBreakTime();
}

// alarm
function beepPlay() {
  $("#beep").trigger('play');
}

// marking the buttons of time customization when disabled
function customizationBtnDisabled() {
  if (currentTime <= 1 || workingTimeSecs > 0) {
    $(".current-timer .minus-btn").addClass("disabled"); 
  } else {
    $(".current-timer .minus-btn").removeClass("disabled"); 
  }
  
  if (breakTime <= 0 || workingTimeSecs > 0) {
    $(".future-timer .minus-btn").addClass("disabled"); 
  } else {
    $(".future-timer .minus-btn").removeClass("disabled"); 
  }
}

function saveToStorage(time, goal, workSession) {
  // saving history in local storage in reversed chronological order
  if (typeof(Storage) !== "undefined") {
    pomodoroHistory.unshift({time: time, goal: goal, workSession: workSession});
    // local storage requires converting strings to the format needed
    localStorage.setItem("pomodoroItems", JSON.stringify(pomodoroHistory));
  } 
}


$(document).ready(function() {
  displayCurrentWorkTime();
  displayCurrentBreakTime();
  
  // hide local storage option if not supported by a browser
  if (typeof(Storage) == "undefined") {
    $("#pomodoro-history").hide();
  } else {
    var pomodoroTemp = JSON.parse(localStorage.getItem("pomodoroItems"));
    if (pomodoroTemp !== null) {
      pomodoroHistory = pomodoroTemp;
    }
  }
  
  // pomodoro history
  $("#pomodoro-history").on("click", function() {
    // cleaning modal content
    $("#history-list").html("");

    // take out each item separately
    for (var i = 0; i < pomodoroHistory.length; i++) {
      var item = pomodoroHistory[i];
      var htmlItem = "<li>On " + item.time + " you worked on " + item.goal + " for " + item.workSession + " " +  (item.workSession == 1 ? "minute" : "minutes") + "</li>";
      $("#history-list").append(htmlItem);
    }
  });
  
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
  
  // restart
  $("#refresh-btn").on("click", function() {
    refresh();
  });
  
});