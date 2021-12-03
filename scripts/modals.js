// Shows the logged in user's notifications, basically shows if a user has a new message or not.
// params: none
// return: none
function notificationModal() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      //Notification button click
      document.getElementById("notification").addEventListener("click", function (e) {
        e.preventDefault();

        let read = db.collection("users").doc(user.uid);

        // With the logged in user, check to see if the field "noti" has a value or not.
        read.get()
          .then(doc => {
            // If there is a value, send the logged in user the recentsender's name and chatID they used to message
            if (doc.data().noti != null) {
              document.getElementById("notificationLabel").innerHTML = "Recent Message!";
              document.getElementById("notificationModText").innerHTML = doc.data().recentSender + " just sent you a message! Message back using this chat ID! " + doc.data().noti;
              // If there's no value, modal will show that the user has not receieved a message yet
            } else {
              document.getElementById("notificationLabel").innerHTML = "Notifications";
              document.getElementById("notificationModText").innerHTML = "No message yet";
            }
          })
      }, false);
    }
  })
}

notificationModal();