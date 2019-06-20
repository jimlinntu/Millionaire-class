window.$ = window.jQuery = require('jquery');
const {ipcRenderer} = require('electron')


ipcRenderer.on("playerListAndScore", function(event, playerListAndScore){
    playerListAndScore.forEach(function(value){
        var name = value["name"];
        var score = value["score"];
        $("#playerList").append("<tr><th scope='row'><h3>" + name + "</h3></th><td><h3>" + score + "</h3></td></tr>");
    })
})

