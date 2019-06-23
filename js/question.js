window.$ = window.jQuery = require('jquery');
const {ipcRenderer} = require('electron')

var questionDict_global = null;
ipcRenderer.on('questionInformation', function(event, questionDict, stage){
    // Save it to global variable
    questionDict_global = questionDict;

    $("#choosenType").text(questionDict["type"]);
    $("#desc").text(questionDict["desc"]);
    if(questionDict["type"] != "一字千金"){
        console.assert(questionDict["choices"].length == 4);
        questionDict["choices"].forEach(function(value, index){
            var choice = String.fromCharCode(65 + index);
            choice += ": " + value;
            $("#choices").append("<div class='col-12 alert alert-primary'><h3>" + choice + "</h3></div>");
        })
    }
    // First stage
    var countdownTime = null;
    if(stage == 1){
        countdownTime = 50;
    }else if(stage == 2){
        countdownTime = 30;
    }else{
        console.log(false, "stage should be 1 or 2");
    }
    // Register countdown function : https://www.w3schools.com/howto/howto_js_countdown.asp
    $("#remainSecond").text(countdownTime).css("color", "red"); 
    setInterval(function(){
        if(countdownTime != 0){
            countdownTime--;
            $("#remainSecond").text(countdownTime).css("color", "red"); // text red
        }
    }, 1000);
});



$("#showAnswer").click(function(){
    ipcRenderer.send("showAnswer");
});

$("#strikethrough").click(function(){
    // Busy waiting in case `questionDict_global` is not finished
    while(!questionDict_global){};
    if(questionDict_global["type"] == "一字千金") return;
    var shuffle_indices = [];
    var answerIndex = questionDict_global['correctAnswer'].charCodeAt(0) - 65;
    // The answer should not be shuffled
    for(var i = 0; i < questionDict_global['choices'].length; i++){
        if(i != answerIndex) shuffle_indices.push(i);
    }
    // shuffle and take the first two choices to strikethrough
    shuffle(shuffle_indices);
    var choices_children = $("#choices").children();
    for(var i = 0; i < 2; i++){
        var indexToBeRemoved = shuffle_indices[i];
        $(choices_children[indexToBeRemoved]).css("text-decoration", "line-through");
    }
});

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

