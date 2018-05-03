/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

// Global variables
let global = {
  searchField: $('.searchField'),
  searchBtn: $('#searchBtn'),
  searchedQuery: $('#searchedQuery')
};

// Global functions
function sendRequestSQL() {
  "use strict";
  try {
    // VARIABLES
    var xhttp;
    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      var DONE = 4; // readyState 4 means the request is done.
      var OK = 200; // status 200 is a successful return.
      if (this.readyState === DONE && this.status === OK) {
        global.searchedQuery.html(this.responseText);
      }
    };
    xhttp.open("POST", "scripts/sqltest/sqltest.js",  true);
    xhttp.send();
  }
  catch(e) {
    console.log('Caught Exception: ' + e.message);
  }
}

// When everything has loaded
$(document).ready(function() {
  "use strict";
  /* EVENT LISTENERS
    ============================================================== */
  global.searchBtn.on("click", function() {
    sendRequestSQL();
  });
});


