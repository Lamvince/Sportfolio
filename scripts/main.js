function insertName() {
  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
      // Do something for the current logged-in user here: 
      console.log(user.uid);
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUser.get()
        .then(userDoc => {
          var user_Name = userDoc.data().name;
          console.log(user_Name);
          //method #1:  insert with html only
          //document.getElementById("name-goes-here").innerText = n;    //using javascript
          //method #2:  insert using jquery
          $("#name-goes-here").text(user_Name); //using jquery
        })
    } else {
      // No user is signed in.
    }
  });
}

// Grabs profile pictures and adds them to Recommened Connections on main.html
function getProfilePic() {
  var count = 1;
  db.collection("users").limit(6).get()
      .then(allUsers => {
          allUsers.forEach(doc => {
              var image = doc.data().userpfp;
              document.getElementById("recommend"+count).innerHTML = "<img class='img-fluid' src=" + image + ">";
              count++;
          })
      })
}

// Grabs sorts user by rank descending and adds highest ranked users to Rank Scoreboard on main.html
function getUserByRank() {
  var count = 1;
  db.collection("users").orderBy("rank", "desc").limit(5).get()
      .then(allUsers => {
          allUsers.forEach(doc => {
              var name = doc.data().name;
              var rank = doc.data().rank;
              var image = doc.data().userpfp;
              document.getElementById("rank"+count).innerHTML = "<img class='img-xs rounded-circle' src=" + image 
                  + "><div class='ml-2'><b>#" + count + ": </b>" + name + "<p class='tx-11 text-muted'>Rank: " + rank + "</p></div>";
              count++;
          })
      })
}

insertName();
getProfilePic();
getUserByRank();