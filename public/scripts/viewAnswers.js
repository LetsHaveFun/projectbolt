/* viewAnswers, also addAnswers NAMESPACE
 ============================================================== */
const viewAnswers = function() {
    // Since the scripts are loaded after the DOM in the HTML, this is possible
    const addOwnAnswerBtn = $('#addOwnAnswerBtn');
    const addAnswerContainer = $('#addAnswerContainer');
    const addAnswerArea = $('#addAnswerArea');

    const addToTable = function(answer) {
        let answerText = answer[0];
        let answerID = answer[1];
    
        let answersTable = document.getElementById("answersTable");
    
        // A row with a answer, user and answers
        let tableRow = document.createElement("div");
        tableRow.setAttribute("class", "Table-row");
    
        // The answer
        let rowItemAnswer = document.createElement("div");
        rowItemAnswer.setAttribute("class", "Table-row-item u-Flex-grow9");
        rowItemAnswer.setAttribute("data-header", "Answer");
        rowItemAnswer.textContent = answerText;

        // The rating
        let rowItemRating = document.createElement("div");
        rowItemRating.setAttribute("class", "star ui rating Table-row-item u-Flex-grow1");
        rowItemRating.setAttribute("data-header", "Rating");
        rowItemRating.setAttribute("id", answerID);
    
        // Append the answer, user and answer to that table row
        tableRow.appendChild(rowItemAnswer);
        tableRow.appendChild(rowItemRating);
    
        // Append the row to the table
        answersTable.appendChild(tableRow);
    };

    const rateAnswer = function rateAnswer(ratingElement) {
        let answerID = ratingElement.attr("id");
        let postData = {
            "answerID": answerID,
            "userID": 1,
            "rating": $('#'+answerID).rating('get rating')
        };        

        console.log("Sending request");
        $.post( "rating/insert-rating", postData, function() {})
        .done(function() {
            console.log("Request complete");
            updateRatings(ratingElement);            
        })
        .fail(function() {
            console.log( "error");
        });
    };

    const updateAllRatings = function updateAllRatings() {
        $('.ui.rating').each(function( index ) {
            let answerID = $(this).attr("id");
            let ratingElement = $(this);

            $.getJSON( "rating/get-all-ratings/"+answerID, function() {})
            .done(function(data) {
                console.log("Request complete");
                let totalRating = 0;
                let ratingCount = data.length;
                $.each( data, function( key, val ) {
                    totalRating += val["Rating"];
                });                 
                averageRating = Math.ceil(totalRating / ratingCount);
                ratingElement.rating('set rating', averageRating);
            })
            .fail(function() {
                console.log( "error");
            })             
        });
    };

    const updateRatings = function updateRatings(ratingElement) {
        let answerID = ratingElement.attr("id");

        $.getJSON( "rating/get-all-ratings/"+answerID, function() {})
        .done(function(data) {
            console.log("Request complete");
            let totalRating = 0;
            let ratingCount = data.length;
            $.each( data, function( key, val ) {
                totalRating += val["Rating"];
            });                 
            averageRating = Math.ceil(totalRating / ratingCount);
            ratingElement.rating('set rating', averageRating)
        })
        .fail(function() {
                console.log( "error");
        })             
    };

    // Add your answer to the currently selected question [No back-end logic yet]
    const addOwnAnswer = function() {
        const toggleContainer = function() {
          viewAnswers.addAnswerContainer.toggle("slow");
        };

        const changeText = function() {
            if( viewAnswers.addAnswerContainer.is(":hidden") ) {
              viewAnswers.addOwnAnswerBtn.text("Hide adding answer");
            }
            else {
              viewAnswers.addOwnAnswerBtn.text("Add your own answer" );
            }
        };

        return {
          toggleContainer: toggleContainer,
          changeText: changeText
        }
    }(); // Immediately invoked

    // Made publicly available
    return {
        // DOM elements
        addOwnAnswerBtn: addOwnAnswerBtn,
        addAnswerContainer: addAnswerContainer,
        addAnswerArea: addAnswerArea,

        // Functions
        addToTable: addToTable,
        rateAnswer: rateAnswer,
        updateAllRatings: updateAllRatings,
        updateRatings: updateRatings,
        addOwnAnswer: addOwnAnswer
    }
}();
//  ============================================================== */

$(document).ready(function() {
    "use strict";
    /* ATTACH EVENT LISTENERS
    ============================================================== */
    viewAnswers.addOwnAnswerBtn.on("click", function(){
      viewAnswers.addOwnAnswer.changeText();
      viewAnswers.addOwnAnswer.toggleContainer();
    });

    console.log("Sending request");
    
    var urlParams = new URLSearchParams(window.location.search);
    var urlEntries = urlParams.entries();
    var questionID = "";
    for(let pair of urlEntries) {
        if (pair[0] === "qid")
        {
            questionID = pair[1]; 
        }        
    }
    
    if (questionID.length > 0)
    {
        $.getJSON( "answers/"+questionID, function() {})
        .done(function(data) {
              console.log("Request complete");
              $.each( data, function( key, val ) {
                // First element contains the question text
                if (key === 0)
                {
                    document.getElementById("questionHeading").textContent = val["Question"];
                }
                else
                {
                    viewAnswers.addToTable([val["Answer"], val["ID"]]);
                }            
              });

              $('.ui.rating').on("click", function(){
                viewAnswers.rateAnswer($(this));
              });

              $('.ui.rating').rating({
                maxRating: 5
              });           
              
              viewAnswers.updateAllRatings();
            })
        .fail(function() {
              console.log( "error");
        }) 
    }
});