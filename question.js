const fs = require('fs')
const parse = require('csv-parse/lib/sync')
const util = require('util')
const assert = require('assert')
var DEBUG = false
var fileString = fs.readFileSync('./data/data.csv', {encoding: 'utf8'});
var records = parse(fileString, {
    columns: true
})
// Throw away timestamp
var blackList = []
for(var i = 0; i < records.length; i++){
    delete records[i]['Timestamp'];
    if(records[i]['題目類型'] == '一字千金'){
        // 刪除 ABCD 選項, 並把 A 放到 correctAnswer 裡面
        delete records[i]['B'];
        delete records[i]['C'];
        delete records[i]['D'];
        records[i]['correctAnswer'] = records[i]['A'];
        delete records[i]['A'];
        delete records[i]['正確選項'];
    }else{
        // check if there are unclean data
        try{
            assert(records[i].A.length > 0 && records[i].B.length > 0 && records[i].C.length > 0 && records[i].D.length > 0)
        }catch(e){
            console.log(e);
        }
        if(records[i].A.length == 0 || records[i].B.length == 0 || records[i].C.length == 0 || records[i].D.length == 0){
            blackList.push(i); // add blacklist
        }
        records[i]['correctAnswer'] = records[i]['正確選項'];
        delete records[i]['正確選項'];
    }
}
// Delete blackList
for(var i = 0; i < blackList.length; i++){
    delete records[blackList[i]]; // result in `undefined`
}

class Question{
    constructor(records){
        // Declare member
        this.type2QuestionList;
        this.type2CurrentQuestionIndex;
        this.typeList;
        // clean records to desired format
        this.cleanRecords(records);
        // shuffle questions
        this.shuffleQuestions();
    }
    // clean records to desired format
    cleanRecords(records){
        var type2QuestionList = {}; // f: type -> [];
        var typeList = [];
        // Parser records
        records.forEach(function(record, i){
            // [*] Note: no need to check undefined, because forEach will pass through it
            var type = record['題目類型'];
            delete record['題目類型'] // delete `type` key
            record["desc"] = record['題目敘述'];
            delete record['題目敘述'];
            
            if(type != "一字千金"){
                record["choices"] = [record.A, record.B, record.C, record.D];
                delete record.A; delete record.B; delete record.C; delete record.D;
            }else{
                record["choices"] = [];
            }
            // Loop over keys(which are types)
            if(type in type2QuestionList){
                type2QuestionList[type].push(record);
            }else{
                // Add type into typeList
                typeList.push(type);
                type2QuestionList[type] = [record]; // put one record in the list
            }
        })

        // Assign these to member variable
        this.type2QuestionList = type2QuestionList;
        this.type2CurrentQuestionIndex = {}; // 記錄現在每個類別分別是在第幾個問題
        for(var i = 0; i < typeList.length; i++){
            var type = typeList[i];
            this.type2CurrentQuestionIndex[type] = -1; // -1 代表這是 list head(or 代表 list end) (pickQuestion 會用到)
        }
        this.typeList = typeList;
    }
    // shuffle all question in their types
    shuffleQuestions(){
        // Can also shuffle choices, but be sure that correct answer is also correct
        for(var type in this.type2QuestionList){
            if(type == "一字千金") continue; // do not shuffle 一字千金 題型
            // shuffle all
            this.type2QuestionList[type] = this.shuffle(this.type2QuestionList[type])
            // shuffle each choices
            var shuffle_indices = [0, 1, 2, 3]
            for(var j = 0; j < this.type2QuestionList[type].length; j++){
                // shuffle index
                shuffle_indices = this.shuffle(shuffle_indices)
                // Apply shuffled indices onto origin choices
                this.type2QuestionList[type][j].choices = this.apply_shuffle_indices(this.type2QuestionList[type][j].choices, shuffle_indices)
                // Remember to change correct answer to another
                var correctAnswerOriginalIndex = this.type2QuestionList[type][j].correctAnswer.charCodeAt(0) - 65;
                this.type2QuestionList[type][j].correctAnswer = String.fromCharCode(shuffle_indices[correctAnswerOriginalIndex] + 65);
            }
        }
        if(DEBUG){
            //console.log(util.inspect(this.type2QuestionList, false, null, true));
            console.log(util.inspect(this.type2QuestionList, false, null));
        }
    }
    apply_shuffle_indices(array, indices){
        var applied_array = new Array(indices.length); // 
        for(var i = 0; i < indices.length; i++){
            var target_new_index = indices[i];
            applied_array[target_new_index] = array[i]; // put array[i] into position of indices[i] in applied_array
        }
        return applied_array;
    }
    // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    shuffle(a){
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
    getCorrectAnswer(type){
        // Return correct answer choice and correct answer's text
        var pickedIndex = this.type2CurrentQuestionIndex[type]; // current index for that type
        var pickedQuestion = this.type2QuestionList[type][pickedIndex]; // current question
        var correctAnswerIndex = pickedQuestion.correctAnswer.charCodeAt(0) - 65; // ascii to index
        var ret = {"correctAnswer": pickedQuestion.correctAnswer, "correctAnswerText": pickedQuestion.choices[correctAnswerIndex]};
        return ret;
    }
    // pick a quesiton. If that type question is running out, we will reshuffle and pick the first one
    pickQuestion(type){
        try{
            assert(type in this.type2QuestionList);
        }catch(e){
            console.log(e);
        }

        var pickedQuestion;
        this.type2CurrentQuestionIndex[type]++; // move one step
        var pickedIndex = this.type2CurrentQuestionIndex[type];
        // if the index reach the end of the list
        if(pickedIndex == this.type2QuestionList[type].length){
            pickedIndex = this.type2CurrentQuestionIndex[type] = 0; // reset to the start of list
            question.shuffleQuestions(); // reshuffle
            if(DEBUG){
                console.log("Shuffling");
            }
        }
        // pick a question from the list
        pickedQuestion = this.type2QuestionList[type][pickedIndex];
        return pickedQuestion;
    }
}
// Instantiate question class
question = new Question(records);

//if(DEBUG){
    console.log(util.inspect(question, false, null, true));
//}


function test(){
    // Test pick question 100 time for all type
    console.log("Start Testing");
    typeList = question.typeList;
    typeList.forEach(function(type){
        for(var i = 0; i < 50; i++){
            picked = question.pickQuestion(type);
            console.log(util.inspect(picked, false, null));
        }
    })

}
if(DEBUG){
    test();
}
// Export the question instance
module.exports = question;
