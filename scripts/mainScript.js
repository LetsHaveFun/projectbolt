/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

// Global variables
let global = {
  searchField: $('.searchField'),
  searchInput: $('#query'),
  questions: [] // will store all the questions from the database
};

var outsideResolve; // will become scriptPromise's Promise.resolve
var outsideReject; // will become scriptPromise's Promise.reject
var scriptPromise = new Promise(function(resolve, reject) {
  "use strict";
  outsideResolve = resolve;
  outsideReject = reject;
});

// Global functions

// Fetch the whole database
function fetchDB() {
  "use strict";
  try {
    // VARIABLES
    var xhttp;
    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      var DONE = 4; // readyState 4 means the request is done.
      var OK = 200; // status 200 is a successful return.
      if (this.readyState === DONE && this.status === OK) {
        // the results from this request will be stored in the questions variable.
        // since the results coming from the AJAX request are as string, split by coma first and then store in array
        global.questions = this.responseText.split(",");
        outsideResolve(global.questions);
      }
    };
    xhttp.open("POST", "dynamic_request_fetchDB", true);
    xhttp.send();
  }
  catch(e) {
    console.log('Caught Exception: ' + e.message);
  }
}

// When everything has loaded
$(document).ready(function() {
  "use strict";
  /* ATTACH EVENT LISTENERS
    ============================================================== */
  global.searchInput.on("input", function() {
    // sendRequestSQL();
    fetchDB(); // send a request that fetches the db rows
    scriptPromise.then(function(resolve) {
      evaluateQuery(resolve);
    });

    // // hacky async ... wait 2 seconds (so the results had for sure arrived and then display them)
    // setTimeout(function() {
    //   evaluateQuery(global.questions);
    // }, 2000);
  });
});



