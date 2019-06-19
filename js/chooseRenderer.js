window.$ = window.jQuery = require('jquery');
const {ipcRenderer} = require('electron')

var buttonInQuestionTypes = $('#questionType button');
var choosenType = null;
buttonInQuestionTypes.click(function(){
    // Clear to clicked state
    buttonInQuestionTypes.each(function(index){
        var classList = $(this).attr('class').split(/\s+/);
        // Turn them into outline 
        for(var i = 0; i < classList.length; i++){
            if(classList[i].includes('btn-') && classList[i].includes('-block') == false 
                && classList[i].includes('btn-outline') == false){
                var addOutlineBtnStr = classList[i].replace('btn-', 'btn-outline-');
                $(this).removeClass(classList[i]);
                $(this).addClass(addOutlineBtnStr);
            }
        }
    })
    // Turn outline into non outline state
    var classList = $(this).attr('class').split(/\s+/);
    for(var i = 0; i < classList.length; i++){
        if(classList[i].includes('btn-outline')){
            var removeOutlineBtnStr = classList[i].replace('btn-outline', 'btn');
            $(this).removeClass(classList[i]);
            $(this).addClass(removeOutlineBtnStr);

            // Record this button is clicked
            choosenType = $(this).text();
        }
    }
})

var buttonContinue = $("#continue");
buttonContinue.click(function(){
    // Check whether the type is choosen
    console.log(choosenType);
    if(choosenType){
        ipcRenderer.send("questionTypeDetermined", choosenType);
    }
})
