// Gets the new user information
// params: user
// return: none
function getNewUserInfo(user) {

  let verified = false;

  let eGender = document.getElementById("userGender");
  let eSport = document.getElementById("userSport");

  let userGender = eGender.options[eGender.selectedIndex].text;
  let userSport = eSport.options[eSport.selectedIndex].text;
  let userTeam = document.getElementById("userTeam").value;
  let userRole;

  //find user role
  if (document.getElementById("role1").checked) {
    userRole = "Athlete";
  } else {
    userRole = "Recruiter";
  }

  console.log("gender " + userGender);
  console.log("sport " + userSport);
  console.log("team " + userTeam);
  console.log("role " + userRole);

  //verify that user filled out whole form
  //unchosen gender is "Gender"
  //unchosen sport is "What sport do you play?"
  //unchosen team is ""

  if (userGender.localeCompare("Gender") == 0) {
    // show modal error if gender is not entered
    accountmodalGenderFail();
  } else if (userSport.localeCompare("What sport do you play?") == 0) {
    // show modal error if sport is not entered
    accountmodalSportFail();
  } else if (userTeam.localeCompare("") == 0) {
    // show modal error if team is not entered
    accountmodalTeamFail();
  } else {
    verified = true;
  }

  if (verified == true) {
    db.collection("users").doc(user.uid).update({
      gender: userGender,
      sport: userSport,
      team: userTeam,
      role: userRole
    });
    // show modal success if account is created
    accountmodalsuccess();
    console.log("verified");
  } else {
    // don't show a modal if account is not created successfully
    console.log("not verified");
    $('#accountMod').modal('hide');



  }
  //once input is verified, add to database
}





// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      var user = authResult.user;
      let temptext = "Click me to create a description!";
      let placeholderimg = "./../images/tempimg.png";
      if (authResult.additionalUserInfo.isNewUser) {

        let temp = "./../images/placeholderpfpfromserver.png";
        console.log("new user");
        db.collection("users").doc(user.uid).set({
            name: user.displayName,
            lowerCaseName: user.displayName.toLowerCase(),
            email: user.email,
            userpfp: temp,
            description: temptext,
            img1: placeholderimg,
            img2: placeholderimg,
            img3: placeholderimg,
            rank: 0
          }).then(function () {
            //before showing main.html, user needs to fill out form
            document.getElementById("new_user_ui").style.display = "block";

            // Add click event for new user submit button
            document.getElementById("btnSubmit").onclick = function () {
              getNewUserInfo(user);
            };
          })
          .catch(function (error) {
            console.log("error is " + error)
          })
      } else {
        console.log("existing user");
        return true;
      }
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader and new user ui.
      document.getElementById('loader').style.display = "none";
      document.getElementById('new_user_ui').style.display = "none";
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: 'main.html',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

// Modal thats displays the account creation being successful, then redirects users to main.html
// params: none
// return: none
function accountmodalsuccess() {
  document.getElementById("accountLabel").innerHTML = "Success!";
  document.getElementById("accountModText").innerHTML = "Account created!"
  $('#accountMod').modal('show');

  // When user hits close on modal success, redirect user to main.html
  document.getElementById("advance").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.assign("main.html")
  }, false);
}

// Shows a fail message if team not entered
// params: none
// return: none
function accountmodalTeamFail() {
  document.getElementById("accountLabel").innerHTML = "Whoops!";
  document.getElementById("accountModText").innerHTML = "Please enter a team."
  $('#accountMod').modal('show');
}

// Shows a fail message if gender not entered
// params: none
// return: none
function accountmodalGenderFail() {
  document.getElementById("accountLabel").innerHTML = "Whoops!";
  document.getElementById("accountModText").innerHTML = "Please enter a gender."
  $('#accountMod').modal('show');
}

// Shows a fail message if sport not entered
// params: none
// return: none
function accountmodalSportFail() {
  document.getElementById("accountLabel").innerHTML = "Whoops!";
  document.getElementById("accountModText").innerHTML = "Please enter a sport."
  $('#accountMod').modal('show');
}