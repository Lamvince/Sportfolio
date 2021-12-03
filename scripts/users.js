let usertext;

// Show is list of all users EXCEPT me (who is logged in)
function showAllUsers() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      myid = user.uid;
      db.collection("users").get()
        .then(snap => {
          snap.forEach(doc => {
            // Go through each user doc in the users collection and if it's a uid that isn't 
            // the logged in user, append their info to the template card
            if (doc.id != myid) {
              let newCard = document.getElementById("card-template")
                .content.cloneNode(true);
              // Replace card-name with current uid's name
              newCard.querySelector('.card-name').innerHTML = doc.data().name;
              // Replace userspfp with current uid's profile picture
              newCard.getElementById("userspfp").src = doc.data().userpfp;
              newCard.querySelector('.card-href').href = "chat.html?uid=" +
                doc.id + "&name=" + doc.data().name; //pass name and id
              // Append newCard to friends-go-here div
              document.getElementById("friends-go-here").appendChild(newCard);

            }
          })
        })

    } else {
      // No user is signed in.
      console.log("no user signed in");
    }
  })
}
showAllUsers();