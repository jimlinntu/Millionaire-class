const fs = require('fs')
const path = require('path')
class Game{
    constructor(){
        this.nowType = null; // record whether the type of quesiton players are playing
        this.nowPlayerList = []; // player list that is being selected in this game
        this.nowPlayerName2Score= {}; // playerName -> Score
        this.candidateList = []; // all available players name
        this.scoreMultiplier = 1; // 1 means the first stage, 2 means the second stage
        this.questionCounter = 0; // 第幾題了
    }
    // load player from file
    loadPlayer(filename){
        var fileString = fs.readFileSync(filename, {encoding: 'utf8'});
        // https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
        fileString = fileString.trim(); // trim spaces and newlines
        this.candidateList = fileString.split(/[\r\n]+/); // split by regex: [\r\n]+
    }
    // Given a playerList, put them into this class member variable
    initPlayer(playerList){
        this.nowPlayerList = playerList;
        // initialize all the players' score
        var gameThis = this;
        this.nowPlayerList.forEach(function(playerName){
            gameThis.nowPlayerName2Score[playerName] = 0; // initialize to 0
        })
    }
    // Given a player list, add 1 * scoreMultiplier to their scores
    updateScore(correctPlayerList){
        var gameThis = this;
        correctPlayerList.forEach(function(playerName){
            gameThis.nowPlayerName2Score[playerName] += gameThis.scoreMultiplier * 1;
        })
        // update the question counter
        this.questionCounter++;
    }
    // Go to second stage
    goToNextStage(){
        this.scoreMultiplier = 2;
    }
    // Get current players' scores
    getResult(){
        var playerListAndScore = [];
        var gameThis = this;
        this.nowPlayerList.forEach(function(playerName){
            var score = gameThis.nowPlayerName2Score[playerName];
            playerListAndScore.push({"name": playerName, "score": score});
        }) 

        return playerListAndScore;
    }
}


game = new Game();
game.loadPlayer(path.resolve(__dirname, "data/player.txt"));
console.log(game.candidateList);

module.exports = game;
