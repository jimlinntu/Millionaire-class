// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.$ = window.jQuery = require('jquery');
const {ipcRenderer} = require('electron')
var startGameButton = document.getElementById('startGame')
if(startGameButton){
    startGameButton.addEventListener('click', startGame);
}

function startGame(e){
    ipcRenderer.send('startGame');
}

let playerList = null;
ipcRenderer.on('playerList', function(event, playerList_){
    playerList = playerList_;
    var playerListDom = $("#playerList");
    console.log(playerListDom);
    playerList.forEach(function(value, index, array){
        playerListDom.append("<li class='list-group-item'>"+ value + "</li>")
    });
})
