const fs = require('fs')
class Game{
    constructor(){
        this.nowType = null; // record whether the type of quesiton players are playing
        this.nowPlayerList = []; // player list that is being selected in this game
        this.nowPlayerScore = []; // each player's score
        this.nowPlayerName2Index = {}; // 
        this.candidateList = []; // all available players name
    }
    // load player from file
    loadPlayer(filename){
        var fileString = fs.readFileSync(filename, {encoding: 'utf8'});
        // https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
        fileString = fileString.trim(); // trim spaces and newlines
        this.candidateList = fileString.split(/[\r\n]+/);
    }
}


game = new Game();
game.loadPlayer("./data/player.txt");
console.log(game.candidateList);

module.exports = game;
