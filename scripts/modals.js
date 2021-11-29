function notificationModal() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      //Notification button click
      document.getElementById("notification").addEventListener("click", function (e) {
        e.preventDefault();

        let read = db.collection("users").doc(user.uid);

        read.get()
          .then(doc => {
            if (doc.data().noti != null) {
              document.getElementById("notificationLabel").innerHTML = "Recent Message!";
              document.getElementById("notificationModText").innerHTML = doc.data().recentSender + " just sent you a message! Message back using this chat ID! " + doc.data().noti;
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