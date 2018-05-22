/* unfoldingHeader NAMESPACE
 ============================================================== */
const unfoldingHeader = function () {

  /* LEGEND
  * GREEN/RED/ORANGE/GRAY collapsing header
  * REQUIREMENTS: ↓
  ** No elements with id #foldingHeader
  ** Place the unfoldingHeader script, before the script that's going to call it
  ** You've used css browser reset: * { margin: 0 } in your CSS (if you want it to look properly)
  * EXAMPLES: ↓
  ** <script src="scripts/unfoldingHeader.js"></script> // in the HTML, before the scripts using it
  ** <script src="yourScript.js></script>
  *
  ** unfoldingHeader.unfoldHeader("Answer added successfully", "green");
  ** unfoldingHeader.unfoldHeader("Please fill in an answer", "red");
  ** unfoldingHeader.unfoldHeader("Warning, password too short", "orange");
 ============================================================== */
  const unfoldHeader = function(textToDisplay, color) {
    // Create a folding header if it doesn't exists
    if($("#foldingHeader").length === 0) {
      /* Create, style and append the folding header
       ============================================================== */
      $("body").prepend("<div id='foldingHeader'></div>");
      const foldingHeader = $('#foldingHeader'); // select locally to the if statement for css manipulation
      foldingHeader.css("display", "flex");
      foldingHeader.css("justify-content", "center");
      foldingHeader.css("align-items", "center");
      foldingHeader.css("width", "100%");
      foldingHeader.css("height", "0"); // will be dynamically changed to trigger the transition effect
      foldingHeader.css("background-color", "#BABABA"); // fallback colour
      foldingHeader.css("background-color", "rgba(186, 186, 186, 0.7)");
      foldingHeader.css("z-index", "10");
      foldingHeader.css("top", "0");
      foldingHeader.css("transition", "height 500ms ease-out");

      /* Create, style and append the text in the folding header
       ============================================================== */
      $('#foldingHeader').append("<p id='headerInfo'></p>");
      const headerInfo = $('#headerInfo'); // select locally to the if statement for css manipulation
      headerInfo.css("font-family", "'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace");
      headerInfo.css("font-size", "14px");
      headerInfo.css("font-style", "normal");
      headerInfo.css("font-variant", "normal");
      headerInfo.css("font-weight", "400");
      headerInfo.css("line-height", "20px");
      headerInfo.css("color", "white");
      headerInfo.css("transition", "visibility 350ms linear");
    }

    const foldingHeader = $('#foldingHeader'); // it's now created, select it
    const headerInfo = $('#headerInfo'); // it's now created, select it

    // If user have scrolled, bind the collapsing bar to the viewport, else it will push content down
    if(window.scrollY !== 0) {
      foldingHeader.css("position", "fixed");
    }

    // Method parameters, colorize folding header in green, red or orange
    switch(color) {
      case "green":
        foldingHeader.css("background-color", "rgb(2, 237, 112)"); // Green
        break;
      case "red":
        foldingHeader.css("background-color", "rgb(139, 0, 0)"); // Red
        break;
      case "orange":
        foldingHeader.css("background-color", "rgb(255, 169, 10)"); // Orange
        break;
      default:
        foldingHeader.css("background-color", "rgb(186, 186, 186)"); // Grey
    }

    // Unfold the header
    foldingHeader.css("height", "50px");
    // Write the folding header text
    headerInfo.text(textToDisplay);
    // Show the folding header text
    headerInfo.css("visibility", "visible");

    // Hide the header after 5 seconds
    setTimeout(function() {
      foldingHeader.css("height", "0"); // unfold it
      headerInfo.css("visibility", "hidden"); // hide the text
    }, 5000)
  };

  return {
    unfoldHeader: unfoldHeader
  }
}();
//  ============================================================== */

