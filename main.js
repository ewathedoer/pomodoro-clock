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
    // show minutes only so 0 when 59 second left from the session time starts
    $("#current-time").text(currentTime - minutes - 1);
  } else {
    $("#current-time").text(currentTime - minutes);
  }
}

function displayCurrentBreakTime(forceSubtractWhenPlay) {
  var minutes = convertToMinutes(breakTimeSecs);
  if (breakTimeSecs > 0 || forceSubtractWhenPlay) {
    $("#break-time").text(breakTime - minutes - 1);
  } else {
    $("#break-time").text(breakTime - minutes);
  }
}

function breakStart() {
  if (convertToMinutes(workingTimeSecs) == currentTime) {
    if (breakTime == 0) {
      // add pomodoro history 
      saveToStorage(new Date(), goal, currentTime);
      
      // giving extra time for the previous beep to beep out
      setTimeout(function() {
        beepPlay();
      }, 1500);
      
      // reset option 
      displayRefreshClocksOption();
    } else {
      $("#break-clock").addClass("animated pulse infinite");
    
      breakIntervalHandler = setInterval(function(){
        breakTimeSecs += 1;
        // check every full minute...
        if (breakTimeSecs % 60 == 0) {
          // ...if the break has finished
          if (convertToMinutes(breakTimeSecs) == breakTime) {
            clearInterval(breakIntervalHandler);
            
            // add pomodoro history 
            saveToStorage(new Date(), goal, currentTime);
            
            beepPlay();

            // reset option 
            displayRefreshClocksOption();
          } else {
            displayCurrentBreakTime();
          }
        }
      }, 1000);
      displayCurrentBreakTime(true);
    }
  }
}

function displayRefreshClocksOption() {
  if ((breakTime == convertToMinutes(breakTimeSecs))) {
    $("#break-clock").removeClass("animated pulse infinite");
    $("#break-time").text("0");
    
    $("#pause-btn").addClass("hidden");
    $("#refresh-btn").removeClass("hidden");
    $(".future-timer").addClass("blurred");
  }
}

// restarting clocks
function refreshPomodoro() {
  $("#goal").val("");
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
  if(checkWebkit()){
    $(".dot, .pie").removeClass("animating");
  } else {
    $(".current-clock .inner-shadow").removeClass("animated pulse infinite");
  }
  
  $("#left .pie, #right .pie, .dot").removeClass("animatable");
  // giving extra time so the browser can reset the animation
  setTimeout(function() {
    $(".dot").removeClass("complete");
    $("#left .pie, #right .pie, .dot").addClass("animatable");
  }, 500);
  
  customizationBtnDisabled();
  displayCurrentWorkTime();
  displayCurrentBreakTime();
}

function beepPlay() {
  $("#beep").trigger('play');
}

// marking visually the buttons of time customization when disabled
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
    // need to catch exceptions here because in e.g. private mode Safari it will fail
    try {
      pomodoroHistory.unshift({time: time, goal: goal, workSession: workSession});
      // local storage requires converting strings to the format needed
      localStorage.setItem("pomodoroItems", JSON.stringify(pomodoroHistory));
    }
    catch (e) {
    }
  } 
}

// manging correct display of time and date below 10th in pomodoro history
function pad(value) {
  if(value < 10) {
    return "0" + value;
  } else {
    return value;
  }
}

function checkWebkit() {
  var agent = navigator.userAgent;
  return agent.indexOf('AppleWebKit') != -1 && agent.indexOf("Chrome") != -1;
}

function startWork() {
  if (breakIntervalHandler == null) {

    intervalHandler = setInterval(function() {
      workingTimeSecs += 1;
      if (workingTimeSecs % 60 == 0) {
        // countdown finished
        if (convertToMinutes(workingTimeSecs) == currentTime) {
          clearInterval(intervalHandler);
          $(".dot").addClass("complete");
          if(checkWebkit()) {
            $(".dot, .pie").removeClass("animating");
          } else {
            $(".current-clock .inner-shadow").removeClass("animated pulse infinite");
          }

          beepPlay();

          breakStart();

          // blur starts
          $(".current-timer-box").addClass("blurred");
        } else {
          displayCurrentWorkTime();
        }
      }
    }, 1000);

    displayCurrentWorkTime(true);
    $("#start-btn").addClass("hidden");
    $("#pause-btn").removeClass("hidden");
    $(".add-btn, .minus-btn").addClass("disabled");
    // for non-webkit browsers use a different animation
    if(checkWebkit()){
      $(".dot, .pie").addClass("animating").css("animation-iteration-count", currentTime);
    } else {
      $(".current-clock .inner-shadow").addClass("animated pulse infinite");
    }
  } else if ((breakTime - convertToMinutes(breakTimeSecs)) > 0) {
    breakStart();
    $("#start-btn").addClass("hidden");
    $("#pause-btn").removeClass("hidden");
    $("#break-clock").addClass("animated pulse infinite");
  }
}

$(document).ready(function() {
  displayCurrentWorkTime();
  displayCurrentBreakTime();
  
  //trigger start if users tap/click the work session clock
  $(".current-clock").on("click", function() {
    startWork();
  });
  
  // manging start-btn attention markers
  setTimeout(function() {
    $("#start-btn").addClass("animated flash attention-btn");
  }, 1000);
  setTimeout(function(){
    $("#start-btn").removeClass("animated flash attention-btn");
  }, 1500);
  
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
    // empty pomodoro history
    if (pomodoroHistory.length == 0) {
      $("#history-list").text("There is no history yet. Go and create some!");
    } else {
      // take out each item separately
      for (var i = 0; i < pomodoroHistory.length; i++) {
        var item = pomodoroHistory[i];
        item.time = new Date(item.time);
        var itemTime = item.time.getFullYear() + "-" + pad(item.time.getMonth()+1) + "-" + item.time.getDate();
        var itemHour = pad(item.time.getHours()) + ":" + pad(item.time.getMinutes());
        var htmlItem = "<li>"
            + "On " + itemTime 
            + " at " + itemHour + " you finished working on " 
            + item.goal + ". You worked for " + item.workSession 
            + " " +  (item.workSession == 1 ? "minute" : "minutes") + "."
          + "</li>";
        $("#history-list").append(htmlItem);
      }
    }
  });
  
  // time spans customization
  timeCustomization();
  
  // starting countdown of work time
  $("#start-btn").on("click", function() {
    startWork();
  }); 
  
  $("#pause-btn").on("click", function() {
    if (breakIntervalHandler == null) {
      if(checkWebkit()){
        $(".dot, .pie").removeClass("animating");
      } else {
        $(".current-clock .inner-shadow").removeClass("animated pulse infinite");
      }
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
    refreshPomodoro();
  });
  
});