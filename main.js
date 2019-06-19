// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let scoreboardWindow

// [*] playerScore: playername(chinese) -> score
let candidateList = ["林子雋", "習大大", "川大大", "愛迪生", "發明者", "祖克柏"]// TODO: Load all player
let playerList = ["林子雋", "習大大"]; 
let playerScore = {};
let questionTopics = ["數學"];
let questionInfoList = [];

// TODO: Load all players
// TODO: Finish question file parser
// TODO: Finish Question class
class Question{
    constructor(){
        this.nowType = null; // Record current type
        this.nowQuestionIndex = -1; // Record current question index in nowType
        this.type2QuestionList = {}; // type : [];
        this.nowPlayerList = [];
        this.nowPlayerScore = []; // each player's score
        this.nowPlayerName2Index = {};
        this.candidateList = [];

    }
    // TODO: shuffle all question in their types
    shuffleQuestions(){
        // Can also shuffle choices, but be sure that correct answer is also correct
    }

    resetQuestions(){
    }

    pickQuestion(){
        // increment counter
        // Once the counter reaches the end of the question list
        // Reset the counter to 0
        // And shuffle questions
    }
    
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'js/preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.webContents.once('did-finish-load', function(){
    mainWindow.webContents.send('candidateList', candidateList);
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


ipcMain.on('startGame', function(e){
    mainWindow.loadFile('choose.html');
    // [*] Wait until loaded and send playerList to next page
    mainWindow.webContents.once('did-finish-load', function(){
    })
})

ipcMain.on("questionTypeDetermined",function(e, choosenTypeStr){
    mainWindow.loadFile('question.html');
    mainWindow.webContents.once('did-finish-load', function(){
        // pick a question
        //
        questionDict = {"type": choosenTypeStr, "desc": "以下哪一個含有英文字母", "choices": ["你", "我", "口腔、食道、胃、大腸、小腸、直腸、肛門", "AAA"]};
        mainWindow.webContents.send('questionInformation', questionDict);
    })
})

ipcMain.on("showAnswer", function(e){
    mainWindow.loadFile("correctAnswer.html");
    mainWindow.webContents.once('did-finish-load', function(){
        var correctAnswer = "D";
        mainWindow.webContents.send('showCorrectAnswer', correctAnswer, playerList);
    })
})

ipcMain.on("nextStage", function(e, correctList){
    // TODO: Add score
    mainWindow.loadFile("choose.html");
    mainWindow.webContents.once('did-finish-load', function(){
    })
})
ipcMain.on("continueStage", function(e, correctList){
    // TODO: Add score
    mainWindow.loadFile("choose.html");
    mainWindow.webContents.once('did-finish-load', function(){
    })
})
ipcMain.on("end", function(e, correctList){
    // TODO: Add score
    mainWindow.loadFile("choose.html");
    mainWindow.webContents.once('did-finish-load', function(){
    })
})

