// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.$ = window.jQuery = require('jquery');
const {ipcRenderer} = require('electron')

var startGameButton = document.getElementById('startGame')
if(startGameButton){
    startGameButton.addEventListener('click', function(e){
    ipcRenderer.send('startGame');
    });
}

/*
let playerList = null;
ipcRenderer.on('playerList', function(event, playerList_){
    playerList = playerList_;
    var playerListDom = $("#playerList");
    console.log(playerListDom);
    playerList.forEach(function(value, index, array){
        playerListDom.append("<li class='list-group-item'>"+ value + "</li>")
    });
})*/

ipcRenderer.on('candidateList', function(event, candidateList){
    var candidateListDom = $("#candidateList");
    console.log(candidateListDom);
    candidateList.forEach(function(value, index, array){
        candidateListDom.append("<li class='list-group-item'>"+ value + "</li>");
    });


    // Add event listener on  candidateList
    var candidateListItem= $("#candidateList li");
    candidateListItem.click(function(){
        // Update li into active or deactivate it
        if($(this).hasClass("active")){
            $(this).removeClass("active");
        }else{
            $(this).addClass("active");
        }
        // Update playerList
        updatePlayerList();
    })
})

function updatePlayerList(){
    var candidateListDom = $("#candidateList");
    // clear playerList children 
    var playerListDom = $("#playerList");
    playerListDom.empty();
    candidateListDom.children().each(function(index){
        if($(this).hasClass("active")){
            playerListDom.append("<div class='col-3' style='color:blue'>"+ $(this).text() +"</div>")
        }
    })

}
