// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const question = require('./question.js')
const game = require('./game.js')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let scoreboardWindow

// [*] playerScore: playername(chinese) -> score

// TODO: Load all players

// TODO: Record game status
class Game{
    constructor(){
        this.scoreMultiplier = 1; // 1 means the first stage, 2 means the second stage
    }
    goToNextStage(){
        this.scoreMultiplier = 2;
    }
}
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'js/preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./pages/index.html')
  mainWindow.webContents.once('did-finish-load', function(){
    mainWindow.webContents.send('candidateList', game.candidateList);
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.on('startGame', function(e, playerList){
    mainWindow.loadFile('./pages/choose.html');
    game.nowPlayerList = playerList;
    console.log(game.nowPlayerList);
    // [*] Wait until loaded and send playerList to next page
    mainWindow.webContents.once('did-finish-load', function(){
        
    })
})

ipcMain.on("questionTypeDetermined",function(e, choosenTypeStr){
    mainWindow.loadFile('./pages/question.html');
    mainWindow.webContents.once('did-finish-load', function(){
        // TODO: pick a question
        pickedQuestionDict = question.pickQuestion(choosenTypeStr);
        pickedQuestionDict.type = choosenTypeStr;
        mainWindow.webContents.send('questionInformation', pickedQuestionDict);
    })
})

ipcMain.on("showAnswer", function(e){
    mainWindow.loadFile("./pages/correctAnswer.html");
    mainWindow.webContents.once('did-finish-load', function(){
        var correctAnswer = "D";
        var correctAnswerText = "Test";
        
        var ret = question.getCorrectAnswer(type);
        mainWindow.webContents.send('showCorrectAnswer', ret.correctAnswer, ret.correctAnswerText, playerList);
    })
})

ipcMain.on("nextStage", function(e, correctList){
    // TODO: Add score
    // TODO: Update `Game`
    mainWindow.loadFile("./pages/choose.html");
    mainWindow.webContents.once('did-finish-load', function(){
    })
})
ipcMain.on("continueStage", function(e, correctList){
    // TODO: Add score
    mainWindow.loadFile("./pages/choose.html");
    mainWindow.webContents.once('did-finish-load', function(){
    })
})
ipcMain.on("end", function(e, correctList){
    // TODO: Add score
    // TODO: Show result

    mainWindow.loadFile("./pages/result.html");
    mainWindow.webContents.once('did-finish-load', function(){
        var playerListAndScore = [{"name": "林子雋", "score": 100}];
        mainWindow.webContents.send("playerListAndScore", playerListAndScore);
    })
})

function parse_csv(){
}
