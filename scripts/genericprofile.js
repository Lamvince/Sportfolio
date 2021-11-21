console.log("hello world");

var queryString = decodeURIComponent(window.location.search);
var queries = queryString.split("?");
var uid = queries[1];
console.log("HERE " + uid);

function showProfileData(uid) {

  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
      // Do something for the current logged-in user here: 
      console.log("hello " + user.uid + " hey " + uid);
      //go to the correct user document by referencing to the user uid
      let profile = db.collection("users").doc(uid);
      //get the document for current user.
      profile.get()
        .then(userDoc => {
          var user_Name = userDoc.data().name;
          var user_sport = userDoc.data().sport;
          var user_team = userDoc.data().team;
          var user_gender = userDoc.data().gender;
          var user_text = userDoc.data().description;
          var user_rank = userDoc.data().rank;

          const imgText = [
            userDoc.data().img1,
            userDoc.data().img2,
            userDoc.data().img3
          ]

          const vidText = [
            userDoc.data().uservid1,
            userDoc.data().uservid2,
            userDoc.data().uservid3
          ]

          console.log("page loaded");
          console.log(user_Name);
          console.log(user_sport);
          console.log(user_team);



        })

    } else {
      // No user is signed in.
    }
  });




}

showProfileData(uid);