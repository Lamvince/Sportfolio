// adds name of user to home page
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
          $("#name-goes-here").text(user_Name); //using jquery
        })
    }
  });
}

// Grabs profile pictures and adds them to Recommened Connections on main.html using the template ConnectionsTemplate
function getProfilePic() {
  let CardTemplate = document.getElementById("ConnectionsTemplate");
  var count = 1;
  // read limited to 6 users only
  db.collection("users").limit(6).get()
      .then(allUsers => {
          allUsers.forEach(doc => {
              var image = doc.data().userpfp;
              let newcard = CardTemplate.content.cloneNode(true);

              // adds profile picture to template
              newcard.querySelector('.profile-pic').src = image;

              document.getElementById("recommend").appendChild(newcard);
              count++;
          })
      })
}

// Grabs sorts user by rank descending and adds top 5 ranked users to Rank Scoreboard on main.html
function getUserByRank() {
  let CardTemplate = document.getElementById("RankTemplate");
  var count = 1;
  // reads using orderBy() to sort by descending and gets first 5 results
  db.collection("users").orderBy("rank", "desc").limit(5).get()
      .then(allUsers => {
          allUsers.forEach(doc => {
              var name = doc.data().name;
              var rank = doc.data().rank;
              var image = doc.data().userpfp;
              let newcard = CardTemplate.content.cloneNode(true);

              //populates scoreboard with user data
              newcard.querySelector('.img-xs').src = image;
              newcard.querySelector('.text').innerHTML = "<b>#" + count + ": </b>" + name + "<p class='tx-11 text-muted'>Rank: " + rank + "</p>";

              document.getElementById("rank-here").appendChild(newcard);    
              count++;
          })
      })
}

insertName();
getProfilePic();
getUserByRank();