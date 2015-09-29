// Login with Node.js and MongoDB



// get form elements from DOM
var forgotPasswordForm = document.getElementById("forgot-password-form"); // from forgotPassword.html
var fpEmailInput = forgotPasswordForm.elements["email"];
var fpSumbitBtn = forgotPasswordForm.elements["submit"];



// bind events to buttons
fpSumbitBtn.onclick = forgotPassword;



// when forgot password form is submitted,
// do something
function forgotPassword(e) {
  e.preventDefault();
  if (checkInput(fpEmailInput)) {
    console.log("Email:" + fpEmailInput.value);
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
