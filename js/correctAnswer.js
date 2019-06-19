window.$ = window.jQuery = require('jquery');
const {ipcRenderer} = require('electron')

ipcRenderer.on('showCorrectAnswer', function(e, correctAnswer, playerList){
    $("#answer").text(correctAnswer);
    playerList.forEach(function(value){
        var prefix = "<div class='form-check'><input class='form-check-input' type='checkbox'><label class='form-check-label'>"
        var suffix = "</label></div>"
        $("#playerList").append(prefix + value + suffix);
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
