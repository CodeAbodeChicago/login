// Login with Node.js and MongoDB



// get form elements from DOM
var createAccountForm = document.getElementById("create-account-form"); // from createAccount.html
var caNameInput = createAccountForm.elements["name"];
var caEmailInput = createAccountForm.elements["email"];
var caUsernameInput = createAccountForm.elements["username"];
var caPasswordInput = createAccountForm.elements["password"];
var caSaveBtn = createAccountForm.elements["save"];
// var caCancelBtn = createAccountForm.elements["cancel"];



// bind events to buttons
caSaveBtn.onclick = createAccount;



// when create account form is submitted,
// do something
function createAccount(e) {
  e.preventDefault();
  if (checkInput(caNameInput) && checkInput(caEmailInput) && checkInput(caUsernameInput) && checkInput(caPasswordInput)) {
    console.log("Name:" + caNameInput.value);
    console.log("Email:" + caEmailInput.value);
    console.log("Username:" + caUsernameInput.value);
    console.log("Password:" + caPasswordInput.value);
  }
  return false;
};



// check user form for input,
// if there is a value return true
function checkInput(input){
  if (input.value != "" && input.value) {
    return true;
  }
  return false;
}
