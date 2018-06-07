/* global NAMESPACE
 ==============================================================
 * A script for abstract, reusable functions                 */

const global = function() {

  /* @return {true} if the field is NOT empty
  ============================================================== */
  const fieldNotEmpty = function(field) {
    "use strict";
    if(typeof field === "string") {
      console.log("fieldNotEmpty expects form elements such as 'input', 'select', 'textarea'");
      return false;
    }
    else {
      return field.val().length > 0;
    }
  };

  /* @return {true} if the field is IS empty
  ============================================================== */
  const fieldIsEmpty = function(field) {
    "use strict";
    if(typeof field === "string") {
      console.log("fieldNotEmpty expects form elements such as 'input', 'select', 'textarea'");
      return false;
    }
    else {
      return field.val().length === 0;
    }
  };

  /* Remove element from array by value
  * const myArr = ["one", "two", "three", "four"];
  * rmElemFromArray(myArr, "two");
  ============================================================== */
  const rmElemFromArray = function remove(array, element) {
    "use strict";
    const value = array.indexOf(element);

    if (value !== -1) {
      array.splice(value, 1);
      return true;
    }
    else {
      return false;
    }
  };

  const redirect = function redirect(route) {
    if(window.location.href.includes("projectboltrenew.azurewebsites")) {
      window.location.href = "https://projectboltrenew.azurewebsites.net/"+route;
    }
    else {
      let portIndex = window.location.href.indexOf(":3000");
      let baseUrl = window.location.href.substring(0, portIndex)
      window.location.href = baseUrl+":3000/"+route;
    }
  };

  const logout = function logout() { 
    sessionStorage.removeItem("projectBoltSessionID");
    window.location.reload();
  };

  /* Console.log an AJAX request error
   * functionName example: logout.name
   * jqXHR examplse: $.ajax( . . . error(function(jqXHR)); $.getJSON().fail(function(jqXHR)
   * DRAWBACKS: ↓
   * NOT GOOD for anonymous functions (You would need to do something like "const buttonID = this.id" and pass that as the first parameter
   * The exact line from where the error got logged will be lost, but it will be known that logAJAXErr function logged it */
  const logAJAXErr = function(functionName, jqXHR) {
    console.log(`${logAJAXErr.name} reporting: 
                  ${functionName} AJAX request failed. Details: ↓
                  Status: ${jqXHR.status}
                  Error thrown: ${jqXHR.statusText}
                  responseText: ↓
                  ${jqXHR.responseText}`);

    /* @returns {duplicatedKey} if the server response contains the phrase in the if includes()
     ============================================================== */
    /* Example of how to use the returned "duplicatedKey: ↓
    *  if(global.logAJAXErr(postAnswer.name, jqXHR) === "duplicatedKey") {
    *     unfoldingHeader.unfoldHeader("This answer already exists", "red");
    *  } */
    if(jqXHR.responseText.includes("Violation of UNIQUE KEY")) {
      return "duplicatedKey";
    }
    // Add your else if here
    else {
      return false;
    }
  };

  return {
    fieldNotEmpty: fieldNotEmpty,
    fieldIsEmpty: fieldIsEmpty,
    rmElemFromArray: rmElemFromArray,
    redirect: redirect,
    logout: logout,
    logAJAXErr: logAJAXErr
  };
}();
//  ============================================================== */