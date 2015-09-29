// Login with Node.js and MongoDB



// get form elements from DOM
var accountSettingsForm = document.getElementById("account-settings-form"); // from accountSettings.html
var asNameInput = accountSettingsForm.elements["name"];
var asEmailInput = accountSettingsForm.elements["email"];
var asUsernameInput = accountSettingsForm.elements["username"];
var asPasswordInput = accountSettingsForm.elements["password"];
var asSaveBtn = accountSettingsForm.elements["save"];
var asDeleteBtn = accountSettingsForm.elements["delete"];
// var asCancelBtn = accountSettingsForm.elements["cancel"];

asSaveBtn.onclick = saveAccountSettings;
asDeleteBtn.onclick = deleteAccount;



// when save account settings form is submitted,
// do something
function saveAccountSettings(e) {
  e.preventDefault();
  if (checkInput(asNameInput) && checkInput(asEmailInput) && checkInput(asUsernameInput) && checkInput(asPasswordInput)) {
    console.log("Name:" + asNameInput.value);
    console.log("Email:" + asEmailInput.value);
    console.log("Username:" + asUsernameInput.value);
    console.log("Password:" + asPasswordInput.value);
  }
  return false;
};

// when delete account is submitted,
// do something
function deleteAccount(e) {
  e.preventDefault();
  console.log("account deleted!");
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
