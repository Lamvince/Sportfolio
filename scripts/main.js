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
insertName();


document.getElementById("notification").addEventListener("click", function (e) {
  e.preventDefault();

  db.collection("users").where("noti", "!=", null)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        alert(doc.data().recentSender + " just send you a message! Message back using this chat ID! " + doc.data().noti);
      });
    })

}, false);