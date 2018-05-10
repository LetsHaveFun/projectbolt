/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

/* Global variables
 ============================================================== */
let questions = [];
var outsideResolve; // will become dbDataLoaded's Promise.resolve
var outsideReject; // will become dbDataLoaded's Promise.reject
var dbDataLoaded = new Promise(function(resolve, reject) {
  "use strict";
  outsideResolve = resolve;
  outsideReject = reject;
});
// =====================================================================================================================

// jQuery AJAX request for "dynamic_request_fetchDB" (will return all the rows from the db and store them in an array)
function fetchAllQuestions() {
  "use strict";
  $.ajax({
    type: 'GET',
    url: 'dynamic_request_fetchDB',
    success: function(data){
      // the results from this request will be stored in the questions variable.
      // since the results coming from the AJAX request are as string, split by coma first and then store in array
      questions = data.split(",");
      outsideResolve(questions);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
      console.log('jqXHR: ' + jqXHR);
      console.log('textStatus: ' + textStatus);
      console.log('errorThrown: ' + errorThrown);
    }
  });
}

let displayQuestions = function() {
  "use strict";
  let theTable = $('.Table')[0]; // since it's class, [0] is the first instance

  for(let i=0;i<questions.length;i++) {
    let tableRow = document.createElement("div");
    tableRow.setAttribute("class", "Table-row");

    let rowItemQuestion = document.createElement("div");
    rowItemQuestion.setAttribute("class", "Table-row-item u-Flex-grow9");
    rowItemQuestion.setAttribute("data-header", "Header1");
    rowItemQuestion.textContent = questions[i];

    let rowItemUser = document.createElement("div");
    rowItemUser.setAttribute("class", "Table-row-item u-Flex-grow1");
    rowItemUser.setAttribute("data-header", "Header2");
    rowItemUser.textContent = "Johny";

    let rowItemAnswer = document.createElement("div");
    rowItemAnswer.setAttribute("class", "Table-row-item u-Flex-grow1");
    rowItemAnswer.style.textDecoration = "underline";
    rowItemAnswer.style.color = "blue";
    rowItemAnswer.setAttribute("data-header", "Header3");
    rowItemAnswer.textContent = "Answers";

    theTable.appendChild(tableRow);
    tableRow.appendChild(rowItemQuestion);
    tableRow.appendChild(rowItemUser);
    tableRow.appendChild(rowItemAnswer);
  }
};

// When everything has loaded
$(document).ready(function() {
  "use strict";
  fetchAllQuestions(); // send a request to fetch all the questions from the db
  dbDataLoaded.then(function(resolve) {
    displayQuestions(); // when the questions arrive, generate and display them
  })
  .catch(function (error) {
    let caughtError = error.message; // if the promise returns an error, catch it
    console.log(caughtError);
  });
});