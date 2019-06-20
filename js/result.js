window.$ = window.jQuery = require('jquery');
const {ipcRenderer} = require('electron')


ipcRenderer.on("playerListAndScore", function(event, playerListAndScore){
    playerListAndScore.forEach(function(value){
        var name = value["name"];
        var score = value["score"];
        $("#playerList").append("<tr><th scope='row'>" + name + "</th><td>" + score + "</td></tr>");
    })
})

