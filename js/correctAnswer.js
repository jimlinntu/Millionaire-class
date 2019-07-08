window.$ = window.jQuery = require('jquery');
const {ipcRenderer} = require('electron')

ipcRenderer.on('showCorrectAnswer', function(e, correctAnswerChoice, correctAnswerText, playerListAndScore){
    // Ignore 一字千金
    if(correctAnswerText){
        $("#answer").text(correctAnswerChoice + ": " + correctAnswerText);
    }else{
        $("#answer").text(correctAnswerChoice);
    }
    playerListAndScore.forEach(function(player){
        // player = { name: Name, score: Score}
        var prefix = "<div class='form-check'><input class='form-check-input' type='checkbox'><label class='form-check-label'>"
        var suffix = "</label><label>, 目前得分為: "+ player.score +"分</label></div>"
        $("#playerList").append(prefix + player.name + suffix);
    })
})

$("#nextStage").click(function(){
    var correctList = computePlayerCorrectList();
    console.log("nextStage");
    ipcRenderer.send("nextStage", correctList);
})
$("#continueStage").click(function(){
    var correctList = computePlayerCorrectList();
    console.log("continueStage");
    ipcRenderer.send("continueStage", correctList);
})

$("#end").click(function(){
    var correctList = computePlayerCorrectList();
    console.log("end");
    ipcRenderer.send("end", correctList);
})

$("#selectAll").click(function(){
    var checkboxList = $("#playerList .form-check .form-check-input");
    var allselect = true;
    checkboxList.each(function(index){
        // if not checked
        if(!$(this).prop("checked")){
            allselect = false;
        }
    })

    if(allselect){
        // Turn all checkboxes into empty
        checkboxList.each(function(index){
            $(this).prop("checked", false);
        })
    }else{
        checkboxList.each(function(index){
            $(this).prop("checked", true);
        })
    }
})

function computePlayerCorrectList(){
    var checkboxList = $("#playerList .form-check .form-check-input");
    var labelList = $("#playerList .form-check .form-check-label");
    var correctList = [];
    checkboxList.each(function(index){
        // checkbox
        if($(this).prop("checked")){
            correctList.push($(labelList[index]).text());
        }
    })
    return correctList;
}
