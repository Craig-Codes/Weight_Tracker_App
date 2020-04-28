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

// Connect to HTML elements
const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");
const dumbellImg = document.querySelector("#dumbell");
const myForm = document.querySelector("#custom-form");

// When loginBtn is pressed, classes are added / removed to switch between Login and Register forms
loginBtn.addEventListener("click", () => {
  dumbellImg.className = "card-img-top img-circle rounded-circle";
  registerBtn.className = "faded-out";
  loginBtn.className = "selected";
  setTimeout(function () { // spin the dumbbell
    dumbellImg.className = "card-img-top img-circle rounded-circle dumbell";
  }, 100);
  myForm.action = "/login";
  myForm.innerHTML =
    '<div class="form-group">' +
    '<input type="text" class="form-control" id="InputUsername" placeholder="&#xf007; Username" style="font-family: Arial, FontAwesome;" /></div>' +
    '<div class="form-group">' +
    '<input type="password" class="form-control" id="InputPassword" placeholder="&#xf023; Password" style="font-family: Arial, FontAwesome;" /></div>' +
    '<button type="submit" class="btn btn-dark">Sign In</button>' +
    '<div id="reset-link"><a href="/reset">Reset password?</a></div>';
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
    '<input type="email" class="form-control" id="email" placeholder="&#xf003; Email address" name="email" style="font-family: Arial, FontAwesome;" required /></div>' +
    '<div class="form-group">' +
    '<input type="number" min="18" max="99" class="form-control" id="InputAge" placeholder="&#xf1fd; Age in years" name="age" style="font-family: Arial, FontAwesome;"  required/></div>' +
    '<div class="form-group">' +
    '<select id="gender" name="gender" style="font-family: Arial, FontAwesome;" class="form-group form-control">' +
    '<option value="placeholder" id="placeholder" disabled selected hidden>&nbsp;&#xf183;&#xf182; Gender</option>' +
    '<option value="male">Male</option>' +
    '<option value="female">Female</option>' +
    '</select>' +
    '<div class="form-group">' +
    '<label for="feet" class="foot">Foot:</label>' +
    '<input type="number" id="InputFoot" name="heightFt" min="4" max="7" required>' +
    '<label for="inches" class="inches">Inches:</label>' +
    '<input type="number" id="InputInches" name="heightIn" min="0" max="11" required></div>' +
    '<div class="form-group">' +
    '<label for="lbs" class="lbs">Lbs:</label>' +
    '<input type="number" id="InputLbs" name="weight" min="1" max="999" step=".1" required></div>' +
    '<button type="submit" class="btn btn-dark">Sign Up</button></form>';
});
