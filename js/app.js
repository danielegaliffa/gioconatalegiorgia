var questions = null;
var questionIndex = null;
var maxQuestions = null;
var points = null;
var loaded_data = null;

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

var _start = function(){
	_setItemVisibility("restartBtn",false);
	_setItemVisibility("loading",false);
	_setItemVisibility("intro",false);
	_setItemVisibility("main",true);
}

var _restart = function(){
	_resetData();
}

var _parseQuestions = function(p_question){
	var data = [];
	points = 0;
	questions = [];
	var answers = [];
	for(var a=0;a<p_question.length;a++){
		var curQ = p_question[a];
		var curItem = {};
		curItem.question = curQ.question;
		curItem.answers = [];
		for(var i=1;i<5;i++){
			if(curQ['answer_'+i] != null){
				var answer = {};
				answer.label = curQ['answer_'+i];
				answer.correct = (i==1)? true : false;
				curItem.answers.push(answer);
			}
		}
		curItem.answers = shuffle(curItem.answers);
		data.push(curItem);
	}
	data = shuffle(data);
	for(var a=0;a<maxQuestions;a++){
		questions.push(data[a]);
	}
	return questions;
}

var _initQuestions = function(){
	if(loaded_data != null){
		questions = _parseQuestions(loaded_data);
		nextQuestion();
	}
}


var _initData = function(){
	var xmlhttp = new XMLHttpRequest();
	var url = "https://opensheet.vercel.app/1nmtGvMlh9Ziua9hOOcnncxpEI24yG6yXirLFSyVN9yk/data";
	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	loaded_data = JSON.parse(this.responseText);
	    	_setupUI();
	    	_initUI();
	        _initQuestions();
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();	
}

var _resetData = function(){
	questions = [];
	questionIndex = -1;
	maxQuestions = 10;
	points = 0;
	_initQuestions();
	_start();
}

function init() {
	_resetData();
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
	if(document.getElementById(p_itemID) != null){
		var item = document.getElementById(p_itemID);
		if(p_value){
			item.classList.remove("hidden");
		}else{
			item.classList.add("hidden");
		}
	}
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
		for(var a=0;a<4;a++){
			var itemID = "answer_"+(a+1);
			_setItemVisibility(itemID,false);
		}

		for(var a=0;a<curQuestion.answers.length;a++){
			var curA = curQuestion.answers[a];
			var itemID = "answer_"+(a+1);
			document.getElementById(itemID).innerHTML = curA.label;
			document.getElementById(itemID).onclick = function() { 
				var index = parseInt(event.target.getAttribute("id").replace('answer_', ''));
				return _answerQuestion(curQuestion.answers[index-1].correct); 
			};
			_setItemVisibility(itemID,true);
		}
	}else{
		txt = "Complimenti! Hai completato il quiz!";
		txt += "<br />";
		txt += "Hai realizzato " + points + " punti!";
		questions_visibility = false;
		_setItemVisibility("restartBtn",true);
	}
	document.getElementById("title").innerHTML = txt;
	_setItemVisibility("questions_box",questions_visibility);
}

var _initUI = function(){
	_setItemVisibility("loading",false);
	_setItemVisibility("main",false);
	_setItemVisibility("intro",true);
}

var _setupUI = function() {
	var prevBtn = document.getElementById("previous_btn");
	var nextBtn = document.getElementById("next_btn");
	var startBtn = document.getElementById("startBtn");
	var restartBtn = document.getElementById("restartBtn");
	if(prevBtn != null)
		prevBtn.onclick = previousQuestion;

	if(nextBtn != null)
		nextBtn.onclick = nextQuestion;

	if(startBtn != null)
		startBtn.onclick = _start;

	if(restartBtn != null)
		restartBtn.onclick = _restart;
}

var _answerQuestion = function(p_value){
	if(p_value == true){
		points++
	}
	nextQuestion();
}