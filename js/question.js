window.$ = window.jQuery = require('jquery');
const {ipcRenderer} = require('electron')

ipcRenderer.on('questionInformation', function(event, questionDict){
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
});


$("#showAnswer").click(function(){
    ipcRenderer.send("showAnswer");
});
