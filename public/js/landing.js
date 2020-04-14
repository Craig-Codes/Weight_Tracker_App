// Preloader
$("body").append(
  '<div style="" id="loadingDiv"><img class="loader" src="/images/preloader.png" alt="Loading..."></div>'
);
$(window).on("load", function () {
  setTimeout(removeLoader, 500);
});
function removeLoader() {
  $("#loadingDiv").fadeOut(500, function () {
    $("#loadingDiv").remove();
  });
}

const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");
const dumbellImg = document.querySelector("#dumbell");
const myForm = document.querySelector("#custom-form");

loginBtn.addEventListener("click", () => {
  dumbellImg.className = "card-img-top img-circle rounded-circle";
  registerBtn.className = "faded-out";
  loginBtn.className = "selected";
  setTimeout(function () {
    dumbellImg.className = "card-img-top img-circle rounded-circle dumbell";
  }, 100);
  myForm.action = "/login";
  myForm.innerHTML =
    '<div class="form-group">' +
    '<input type="text" class="form-control" id="InputUsername" placeholder="&#xf007; Username" style="font-family: Arial, FontAwesome;" /></div>' +
    '<div class="form-group">' +
    '<input type="password" class="form-control" id="InputPassword" placeholder="&#xf023; Password" style="font-family: Arial, FontAwesome;" /></div>' +
    '<button type="submit" class="btn btn-secondary">Sign In</button>' +
    "<div><p>Forgotten password?</p></div></form>";
});

registerBtn.addEventListener("click", () => {
  dumbellImg.className = "card-img-top img-circle rounded-circle";
  loginBtn.className = "faded-out";
  registerBtn.className = "selected";
  setTimeout(function () {
    dumbellImg.className =
      "card-img-top img-circle rounded-circle dumbell-left";
  }, 100);
  myForm.action = "/register";
  myForm.innerHTML =
    '<form id="custom-form" action="/register" method="POST">' +
    '<div class="form-group">' +
    '<input type="text" class="form-control" id="InputUsername" placeholder="&#xf007; Username" name="username" style="font-family: Arial, FontAwesome;" required/></div>' +
    '<div class="form-group">' +
    '<input type="password" class="form-control" id="InputPassword" placeholder="&#xf023; Password" name="password" style="font-family: Arial, FontAwesome;" required /></div>' +
    '<div class="form-group">' +
    '<input type="password" class="form-control" id="ConfirmPassword" placeholder="&#xf084; Confirm password" name="passwordCheck" style="font-family: Arial, FontAwesome;" required /></div>' +
    '<div class="form-group">' +
    '<input type="number" min="18" max="99" class="form-control" id="InputAge" placeholder="&#xf073; Age" name="age" style="font-family: Arial, FontAwesome;"  required/></div>' +
    '<div class="form-group">' +
    '<label for="male">Male</label>' +
    '<input type="radio" id="male" class="male" name="gender" value="male" required>' +
    '<label for="female" class="female">Female</label>' +
    '<input type="radio" id="female" name="gender" value="female"></div>' +
    '<div class="form-group">' +
    '<label for="feet" class="foot">Foot:</label>' +
    '<input type="number" id="InputFoot" name="heightFt" min="0" max="7" required>' +
    '<label for="inches" class="inches">Inches:</label>' +
    '<input type="number" id="InputInches" name="heightIn" min="0" max="11" required></div>' +
    '<div class="form-group">' +
    '<label for="lbs" class="lbs">Lbs:</label>' +
    '<input type="number" id="InputLbs" name="weight" min="50" max="500" required></div>' +
    '<button type="submit" class="btn btn-secondary">Sign Up</button></form>';
});
