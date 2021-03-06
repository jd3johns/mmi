
var timer;
var counter;
var question_number = -1;
var question_indices;

$( document ).ready(function() {
  $('.question').hide();
  // Create array of indices for the question set
  question_indices = Array.apply(null, Array(questions.length)).map(
  function (_, i) {return i;}
  );

  // Randomize the indices in linear time
  shuffle(question_indices);
});

$(document).keydown(function(e){
  if(e.keyCode == 13) {
    change_state();
  }else if (e.keyCode == 37 && question_number > -1){
    question_number -= (question_number > 0) ? 1 : 0;
    next_question();
  }else if (e.keyCode == 39){
    question_number += (question_number < questions.length) ? 1 : 0;
    next_question(); 
  }
});

function change_state(){
  var state = $('.question').attr('data-state');

  if(state == "prep"){
    start_countdown(8);
    $('.action').html("to go to next question");
    $('.question').attr('data-state', 'answer');
    $('#state').html("Time left to answer:");
  }else if (question_number < questions.length) { // answer or null
    question_number++;
    next_question();
  }
}

function next_question(){
  start_countdown(2);
  $('.action').html("to answer the question");
  $('.question').attr('data-state', 'prep');
  $('#state').html("Time left to prepare:");

  display_question();

  $('.question').show();
  $('.instructions').show();
  $('.intro').hide();
}

function start_countdown(time){
  clearInterval(counter);
  $('#timer').html(prettify_number(time) + ':00');
  var start = new Date;

  counter = setInterval(function(){
    var end = new Date;
    var negative = "";

    var seconds = Math.ceil((time * 60) - (end - start)/1000);
    var minutes = Math.floor(Math.abs(seconds)/ 60);

    seconds = seconds % 60;

    if( seconds < 0){
      $('#timer').addClass("error");
      negative = '-';
    }else{
      $('#timer').removeClass("error");
    }

    $('#timer').html(negative + prettify_number(minutes) + ':' + prettify_number(seconds));

  },1000);
}

function prettify_number(number){
  var number = Math.abs(number);
  if(number < 10){
    return ('0' + number);
  }else{
    return number;
  }
}

function display_question(){
  var question = questions[question_indices[question_number]];
  if(question){
    $('.text').html('('+ (question_number + 1)+') ' +question.question);

    var src = source[question.source];
    $('#source').html('<a href="'+src.link+'">' + src.institution.full + ", " + src.year +  '</a>');
    $('#timer').show();
    $('#state').show();
  }else{
    $('.text').html('Congrats! You answered all the questions. <br>Come back again!');
    $('#source').html('');
    $('#timer').hide();
    $('#state').hide();
  }
}

function shuffle(array) {
  var tmp, i, m = array.length;

  while (m) {
    // Pick remaining element
    i = Math.floor(Math.random() * m--);

    // Swap with current element from end
    tmp = array[m];
    array[m] = array[i];
    array[i] = tmp;
  }

  return array;
}
