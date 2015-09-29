// Login with Node.js and MongoDB



// get form elements from DOM
var loginForm = document.getElementById("login-form"); // from index.html
var loginUsernameInput = loginForm.elements["username"];
var loginPasswordInput = loginForm.elements["password"];
var loginBtn = loginForm.elements["login"];



// bind events to buttons
loginBtn.onclick = login;



// when login form is submitted,
// do something
function login(e) {
  // e.preventDefault();
  if (checkInput(loginUsernameInput) && checkInput(loginPasswordInput)) {
    console.log("Username:" + loginUsernameInput.value);
    console.log("Password:" + loginPasswordInput.value);
  }
  // return false;
};



// check user form for input,
// if there is a value return true
function checkInput(input){
  if (input.value != "" && input.value) {
    return true;
  }
  return false;
}
