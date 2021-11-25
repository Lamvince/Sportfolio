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
  console.log("role "+ userRole);

  //verify that user filled out whole form
  //unchosen gender is "Gender"
  //unchosen sport is "What sport do you play?"
  //unchosen team is ""

  if (userGender.localeCompare("Gender") == 0) {
    alert("Please choose a gender");
  } else if (userSport.localeCompare("What sport do you play?") == 0) {
    alert("Please choose a sport");
  } else if (userTeam.localeCompare("") == 0) {
    alert("Please enter a team");
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
    alert("Account creation successful!");
    console.log("verified");
    window.location.assign("main.html")
  } else {
    console.log("not verified");
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
      let placeholderimg = "./images/tempimg.png";
      if (authResult.additionalUserInfo.isNewUser) {

        let temp = "https://firebasestorage.googleapis.com/v0/b/sportfolio-96c76.appspot.com/o/images%2Fplaceholderpfpfromserver.png?alt=media&token=9f8ca543-9f0a-47c4-aa2b-217918ed8629"
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
          document.getElementById("btnSubmit").onclick = function () { getNewUserInfo(user); };
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