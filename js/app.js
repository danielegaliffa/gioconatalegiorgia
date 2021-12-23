var questions = [];
var questionIndex = -1;
var maxQuestions = 10;
var answers = [];
var points = 0;
var loaded_data;

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) {
  	randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
	[array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Used like so
var arr = [2, 11, 37, 42];
shuffle(arr);

var _parseQuestions = function(p_question){
	var data = [];
	points = 0;
	questions = [];
	answers = [];
	for(var a=0;a<p_question.length;a++){
		var curQ = p_question[a];
		curQ.answers = [];
		for(var i=1;i<5;i++){
			var answer = {};
			answer.label = curQ['answer_'+i];
			answer.correct = (i==1)? true : false;
			curQ.answers.push(answer);
			delete curQ['answer_'+i];
		}
		curQ.answers = shuffle(curQ.answers);
		data.push(curQ);
	}
	data = shuffle(data);
	for(var a=0;a<maxQuestions;a++){
		questions.push(data[a]);
	}
	return questions;
}

var _setupQuestions = function(){
	questions = _parseQuestions(loaded_data);
	nextQuestion();
}


var _initData = function(){
	questionIndex = -1;
	var xmlhttp = new XMLHttpRequest();
	var url = "https://opensheet.vercel.app/1nmtGvMlh9Ziua9hOOcnncxpEI24yG6yXirLFSyVN9yk/data";
	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	loaded_data = JSON.parse(this.responseText);
	        _setupQuestions();
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function init() {
	_setupUI();
	_initData();
}

var previousQuestion = function(){
	questionIndex--;
	_renderQuestion();
}

var nextQuestion = function(){
	questionIndex++;
	_renderQuestion();
}

var _setItemVisibility = function(p_itemID,p_value){
	if(document.getElementById(p_itemID) != null)
		document.getElementById(p_itemID).style.visibility = (p_value == true)? "visible" : "hidden";
}


var _renderQuestion = function() {
	_setItemVisibility("previous_btn",(questionIndex>0));
	_setItemVisibility("next_btn",(questionIndex<questions.length-1));

	var questions_visibility = true;
	var txt = "";
	var curQuestion = questions[questionIndex];
	if(curQuestion != null){
		txt = "Domanda n." + parseInt(questionIndex+1);
		txt += "<br />"
		txt += curQuestion.question;
		for(var a=0;a<curQuestion.answers.length;a++){
			var curA = curQuestion.answers[a];
			document.getElementById("answer_"+(a+1)).innerHTML = curA.label + " " + curA.correct;
			document.getElementById("answer_"+(a+1)).onclick = function() { 
				var index = parseInt(event.target.getAttribute("id").replace('answer_', ''));
				return _answerQuestion(curQuestion.answers[index-1].correct); 
			};
		}
	}else{
		txt = "Complimenti! Hai completato il quiz!";
		txt += "<br />";
		txt += "Hai realizzato " + points + " punti!";
		questions_visibility = false;
	}
	document.getElementById("title").innerHTML = txt;
	_setItemVisibility("questions_box",questions_visibility);
}

var _setupUI = function() {
	var prevBtn = document.getElementById("previous_btn");
	var nextBtn = document.getElementById("next_btn");
	if(prevBtn != null)
		prevBtn.onclick = previousQuestion;

	if(nextBtn != null)
		nextBtn.onclick = nextQuestion;
}

var _answerQuestion = function(p_value){
	if(p_value == true){
		points++
	}
	nextQuestion();
}