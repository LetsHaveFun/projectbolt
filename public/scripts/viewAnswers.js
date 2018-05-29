/* viewAnswers, also addAnswers NAMESPACE
 ============================================================== */
const viewAnswers = function() {
    // DOM selectors
    const addOwnAnswerBtn = $('#addOwnAnswerBtn');
    const addAnswerContainer = $('#addAnswerContainer');
    const addAnswerArea = $('#addAnswerArea');
    const submitAnswerBtn = $('#submitAnswerBtn');
    const cancelAnswerBtn = $('#cancelAnswerBtn');

    // Vanilla JS
    const loader = document.getElementById("loader");

    // Make the answers table with the heading columns
    const mkAnswersTableSkeleton = function() {
      /* CREATES
      ============================================================== */

      // The answers table that will hold every row
      const answersTable = document.createElement("div");
      answersTable.setAttribute("id", "answersTable");
      answersTable.setAttribute("class", "Table");

      // Table headers
      const tableHeader = document.createElement("div");
      tableHeader.setAttribute("class", "Table-row Table-header");

      // Answers column
      const answersColumn = document.createElement("div");
      answersColumn.setAttribute("class", "Table-row-item u-Flex-grow9");
      answersColumn.textContent = "Answer";

      // User column
      const userColumn = document.createElement("div");
      userColumn.setAttribute("class", "Table-row-item u-Flex-grow1");
      userColumn.textContent = "User";

      // Ratings column
      const ratingsColumn = document.createElement("div");
      ratingsColumn.setAttribute("class", "Table-row-item u-Flex-grow1");
      ratingsColumn.textContent = "Rating";

      /* APPENDS
      ============================================================== */

      // Append the answer and rating columns to the table header
      tableHeader.appendChild(answersColumn);
      tableHeader.appendChild(userColumn);
      tableHeader.appendChild(ratingsColumn);

      // Append that table header to the answers table
      answersTable.appendChild(tableHeader);

      // Append that answers table to the main container
      document.getElementById("mainContainer").appendChild(answersTable);

      return true;
    };

    const addToTable = function(answer) {
        let answerText = answer[0];
        let answerID = answer[1];
        let username = answer[2];

        // Select the table to append rows to
        const answersTable = document.getElementById("answersTable");

        /* CREATES
        ============================================================== */

        // A row with a answer, user and answers
        const tableRow = document.createElement("div");
        tableRow.setAttribute("class", "Table-row");

        // The answer
        const rowItemAnswer = document.createElement("div");
        rowItemAnswer.setAttribute("class", "Table-row-item u-Flex-grow9");
        rowItemAnswer.setAttribute("data-header", "Answer");
        rowItemAnswer.textContent = answerText;

        // The user
        const rowUser = document.createElement("div");
        rowUser.setAttribute("class", "Table-row-item u-Flex-grow1");
        rowUser.setAttribute("data-header", "User");
        rowUser.textContent = username;

        // The rating
        const rowItemRating = document.createElement("div");
        rowItemRating.setAttribute("class", "star ui rating Table-row-item u-Flex-grow1");
        rowItemRating.setAttribute("data-header", "Rating");
        rowItemRating.setAttribute("id", answerID);

        /* APPENDS
        ============================================================== */

        // Append the answer, user and rating to that table row
        tableRow.appendChild(rowItemAnswer);
        tableRow.appendChild(rowUser);
        tableRow.appendChild(rowItemRating);

        // Append the row to the table
        answersTable.appendChild(tableRow);

        return true;
    };

    // Remove the answers table from the DOM
    const rmAnswersTable = function() {
      const answersTable = document.getElementById("answersTable");
      answersTable.parentNode.removeChild(answersTable);

      return true;
    };

    // UI section for posting answers
    const addOwnAnswer = function() {
        const toggleContainer = () => new Promise(resolve =>
          addAnswerContainer.toggle("slow", resolve)
        );

        const toggleButtons = () => new Promise(resolve => {
          submitAnswerBtn.toggle("slow");
          cancelAnswerBtn.toggle("slow", resolve);
        });

        const changeText = function() {
          if( addAnswerContainer.is(":hidden") ) {
            addOwnAnswerBtn.text("Add your own answer" );
          }
          else {
            addOwnAnswerBtn.text("Hide adding answer");
          }
        };

        const toggleUI = function() {
          toggleContainer();
          toggleButtons()
              .then(changeText);
        };

        return {
          toggleUI: toggleUI
        }
    }(); // Immediately invoked

    // Grab the question id from the URL
    const getQuestionID = function() {
      var urlParams = new URLSearchParams(window.location.search);
      var urlEntries = urlParams.entries();
      var questionID = "";

      for(let pair of urlEntries) {
        if (pair[0] === "qid")
        {
          questionID = pair[1];
        }
      }
      return questionID;
    };

    // AJAX post answer
    const postAnswer = function (bodyJSON){
      "use strict";
      $.ajax({
        type: 'POST',
        data: bodyJSON,
        url: 'answers/add-answer',
        success: function(){
          console.log(`${postAnswer.name} says: Answer added successfully`);
        },
        error: function(jqXHR) {
          // If the server response includes "Violation of UNIQUE KEY"
          if(global.logAJAXErr(postAnswer.name, jqXHR) === true) {
            // The user is trying to add an already existing answer
            unfoldingHeader.unfoldHeader("This answer already exists", "red");
          }
          // More general error
          else {
            unfoldingHeader.unfoldHeader("Failed to post your answer. Apologies :(", "orange");
          }
        }
      });
    };

    // AJAX get all answers request + not only
    const getAnswers = function() {
      return new Promise(function(resolve, reject) {
        let questionID = getQuestionID();
        let sessionID = sessionStorage.getItem('projectBoltSessionID');

        $.getJSON( "answers/"+questionID+"/"+sessionID, function() {})
            .done(function(data) {
              console.log("Request complete");
              $.each( data, function( key, val ) {
                // First element contains the question text
                if (key === 0) {
                  document.getElementById("questionHeading").textContent = val["Question"];
                }
                else {
                  viewAnswers.addToTable([val["Answer"], val["ID"], val["Username"]]);
                }
              });

              $('.ui.rating').on("click", function(){
                addRating.rateAnswer($(this));
              });

              $('.ui.rating').rating({
                maxRating: 5
              });

              viewRatings.updateAllRatings();
              resolve("Answers arrived"); // All answers arrived, resolve the promise
            })
            .fail(function(jqXHR) {
              global.logAJAXErr(getAnswers.name, jqXHR);
              unfoldingHeader.unfoldHeader("Failed to obtain the answers. Apologies :(", "orange");
              reject(`Failed to fetch answers for ↓ \n questionID: ${questionID}, sessionID: ${sessionID}`);
            })
      });
    };

    // Visually manipulate the loader
    const loaderUI = function() {
      const showLoader = () => loader.style.display = "block";
      const hideLoader = () => loader.style.display = "none";

      return {
        showLoader: showLoader,
        hideLoader: hideLoader
      }
    }(); // IIFE;

    // Visually manipulate the answers table
    const answersTableUI = function() {
      const table = document.getElementById("answersTable");

      const hide = () => table.style.visibility = "hidden";
      const show = () => table.style.visibility = "visible";
      const fadeIn = () => table.style.opacity = "1";

      return {
        hide: hide,
        show: show,
        fadeIn: fadeIn
      }
    }; // NOT IIFE;

    // Made publicly available
    return {
        // DOM elements that need to be accessed outside the namespace
        addOwnAnswerBtn: addOwnAnswerBtn,
        submitAnswerBtn: submitAnswerBtn,
        cancelAnswerBtn: cancelAnswerBtn,
        addAnswerArea: addAnswerArea,

        // Functions
        mkAnswersTableSkeleton: mkAnswersTableSkeleton,
        addToTable: addToTable,
        rmAnswersTable: rmAnswersTable,
        addOwnAnswer: addOwnAnswer, // return functions
        getQuestionID: getQuestionID,
        postAnswer: postAnswer,
        getAnswers: getAnswers,
        loaderUI: loaderUI, // return functions
        answersTableUI: answersTableUI // execute first to get the functions
    }
}();
//  ============================================================== */

$(document).ready(function() {
    "use strict";
    /* ATTACH EVENT LISTENERS
    ============================================================== */
    viewAnswers.addOwnAnswerBtn.on("click", function(){
      viewAnswers.addOwnAnswer.toggleUI();
    });

    viewAnswers.submitAnswerBtn.on("click", function() {
      const buttonID = this.id; // for logging purposes

      $.ajax({
        type: 'get',
        url: 'login/get-userID/'+sessionStorage.getItem('projectBoltSessionID'),
        success: function (data) {

          if(global.fieldNotEmpty(viewAnswers.addAnswerArea)) {

            // JSON'ize the question
            let bodyJSON = {
              questionID: viewAnswers.getQuestionID(),
              answer: viewAnswers.addAnswerArea.val(),
              userID: data.userID,
              sessionID: sessionStorage.getItem('projectBoltSessionID')
            };

            // Send the AJAX request
            viewAnswers.postAnswer(bodyJSON);
            viewAnswers.addOwnAnswer.toggleUI();
            viewAnswers.addAnswerArea.val(''); // Reset textarea

            /* RE-FETCH all the answers
            ============================================================== */
            viewAnswers.rmAnswersTable(); // Remove the answers table from the DOM (so it can be recreated)
            viewAnswers.mkAnswersTableSkeleton(); // Create a new answers table
            viewAnswers.answersTableUI().hide();
            viewAnswers.loaderUI.showLoader();
            // Populate the answers table again (with the new answers)
            viewAnswers.getAnswers().then(function() {
              // When answers arrive animate them in
              viewAnswers.loaderUI.hideLoader();
              viewAnswers.answersTableUI().show();
              viewAnswers.answersTableUI().fadeIn();
            })
            .catch(function(reject) {
              console.log(`getAnswers promise got rejected, reject message: ↓ \n ${reject}`);
            })
          }
          else {
            unfoldingHeader.unfoldHeader("Please fill in an answer", "red");
          }
        },
        error: function (jqXHR) {
          unfoldingHeader.unfoldHeader('Invalid session, please logout and login again. Apologies :(', "red");
          global.logAJAXErr(buttonID, jqXHR);
        }
      });
    });

    viewAnswers.cancelAnswerBtn.on("click", function() {
      viewAnswers.addAnswerArea.val(''); // Reset textarea
      viewAnswers.addOwnAnswer.toggleUI();
    });

    console.log("Sending get answers request");
    viewAnswers.mkAnswersTableSkeleton(); // Create the answers table skeleton
    viewAnswers.loaderUI.showLoader();
    // Populate the answers table
    viewAnswers.getAnswers().then(function() {
      // Animate-in the newly arrived answers
      viewAnswers.loaderUI.hideLoader();
      viewAnswers.answersTableUI().fadeIn();
      return true;
    })
    .catch(function(reject) {
      console.log(`getAnswers promise got rejected, reject message: ↓ \n ${reject}`);
      return false;
    })
});