// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.$ = window.jQuery = require('jquery');
const {ipcRenderer} = require('electron')

var startGameButton = document.getElementById('startGame')
startGameButton.addEventListener('click', function(e){
var playerList = getPlayerList();
ipcRenderer.send('startGame', playerList);
});

var candidate_selector = "#candidateList div div button";
ipcRenderer.on('candidateList', function(event, candidateList){
    var candidateListDom = $("#candidateList");
    var prefix = "<div class='card col-3'><div class='card-body'><button type='button' class='btn btn-light btn-lg'><h3>"
    var suffix = "</h3></button></div></div>";

    candidateList.forEach(function(value, index, array){
        candidateListDom.append(prefix + value + suffix);
    });


    // Add event listener on  candidateList
    var candidateListItem= $(candidate_selector);
    candidateListItem.click(function(){
        if($(this).hasClass("btn-light")){
            $(this).removeClass("btn-light");
            $(this).addClass("btn-primary");
        }else{
            $(this).removeClass("btn-primary");
            $(this).addClass("btn-light");
        }
        // Update playerList
        updatePlayerList();
    })
})

function updatePlayerList(){
    var candidateListDom = $(candidate_selector);
    // clear playerList children 
    var playerListDom = $("#playerList");
    playerListDom.empty();
    candidateListDom.each(function(index){
        if($(this).hasClass("btn-primary")){
            playerListDom.append("<div class='col-3'><h3>"+ $(this).text() +"</h3></div>")
        }
    })

}
// get selected playerList
function getPlayerList(){
    var candidateListDom = $(candidate_selector);
    var playerList = [];
    candidateListDom.each(function(index){
        if($(this).hasClass("btn-primary")){
            playerList.push($(this).text());
        }
    })
    return playerList;
}
