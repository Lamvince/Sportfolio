let uid;
var sender;

// Initializes the chat
// params: none
// return: none
function initChat() {
  //get the ID of who we are chatting with
  let params = new URL(window.location.href);
  uid = params.searchParams.get("uid"); //parse "uid"
  let name = params.searchParams.get("name"); //parse "name"
  console.log(uid);

  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
      let userNow = db.collection("users").doc(user.uid);

      // sender variable is assigned value of the logged in user's name
      userNow.get().then(userDoc => {
        sender = userDoc.data().name;
      })
    }
  });

  //set the title to show that person's name
  document.getElementById("friend").innerHTML = name;

  // generate a random 4 digit ID
  chatid = Math.random().toString().substr(2, 4);
  console.log(chatid);
  db.collection("chats").doc(chatid).set({
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(doc => {

    // Display modal
    modalChat();

  })
}
initChat();

// Shows the modal and changes the text of the modal using DOM
function modalChat() {
  document.getElementById("chatModText").innerHTML = "Your Chat ID is " + chatid +
    ". Pass this to your friend and enter the id into the box below and save it.";

  $('#chatMod').modal('show');
}


// This function allows the Logged in user post a message. 
// Will create a new doc with .add() to Firestore messsages
// subcollection for this chat.
function postMessageListen(chatid) {
  var textInput = document.getElementById("text");
  var postButton = document.getElementById("post");

  postButton.addEventListener("click", function () {
    var msgText = textInput.value; //user provided message
    firebase.auth().onAuthStateChanged(function (user) {
      db.collection('users').doc(user.uid).get().then(doc => {
        // Gets the profile picture of the user, need it to display it beside the posted message
        let pfp = doc.data().userpfp;
        db.collection('chats').doc(chatid).collection("messages")
        .add({
          
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          name: user.displayName,
          text: msgText,
          userpfp: pfp,

          userid: user.uid
        })


      // Once the message is posted, the target user recieves the chat ID and the name of the user who sent them
      // the message
      db.collection("users").doc(uid).update({
        noti: chatid,
        recentSender: sender
      });

      })

    })
  });
}


//This function clears the entire chat log.
//gets the messsages collection, and deletes each doc one by one
//in Firestore, and deletes the DOM of class name "msg" (see template)
// params: chatid
// return: none
function clearButtonListen(chatid) {
  var clearButton = document.getElementById("clear");
  clearButton.addEventListener("click", function () {
    console.log("in clear function");
    // Deletes all the message docs for the specific chat id
    db.collection('chats').doc(chatid).collection("messages")
      .get()
      .then(snap => {
        snap.docs.forEach(doc => {
          doc.ref.delete();
        })
        var msg = document.getElementsByClassName("item");
        while (msg[0]) {
          msg[0].remove();
        }
      })
  })
}

// Quits the chat session and sends the user back to users.html
// params: chatid
// return: none
function quitButtonListen(chatid) {
  var quitButton = document.getElementById("quit");
  quitButton.addEventListener("click", function () {
    db.collection("chats").doc(chatid)
      .get()
      .then(snap => {
        snap.ref.delete();
        window.location.href = "users.html";
      })

  })
}


// When a new message doc has been added, let's display it.
// Use "onSnapshot()" to listen to changes.
// https://firebase.google.com/docs/firestore/query-data/listen.html#view_changes_between_snapshots
// params: chatid
// return: none
function listenNewMessage(chatid) {
  // Listens to all the new message docs for that chat ID and displays it.
  db.collection("chats").doc(chatid).collection("messages")
    .onSnapshot(snap => {
      snap.docChanges().forEach(change => {
        if (change.type == "added") {
          console.log("new message ", change.doc.data());
          let msgCard = document.getElementById("card-template")
            .content.cloneNode(true);
          // img src replaced with corresponding user pfp received when we updated message doc with the sent user's pfp link
          msgCard.querySelector('img').src = change.doc.data().userpfp;
          // card body text changed to the message text that was posted
          msgCard.querySelector('.card-body').innerHTML = change.doc.data().text;
          // card name changed to name of the sender
          msgCard.querySelector('.card-name').innerHTML = change.doc.data().name;
          document.getElementById("results").appendChild(msgCard);
        }
      })
    })
}

// When the user hits the Enter chat id button with the correct chat id, chat session is activated
document.getElementById("savetext").addEventListener("click", function (e) {
  e.preventDefault();

  // Get user chat id input from input box when the button is clicked
  let usertext = document.getElementById("textChatID").value;

  usertext = usertext.trim();
  console.log(usertext);

  // Go through each chat document
  db.collection("chats").get()
    .then(snap => {
      snap.forEach(doc => {
        // If the chat doc id matches the user's input, call the following functions passing that chat id as the paramater.
        if (doc.id == usertext) {
          console.log(uid);
          console.log(doc.id);
          chatid = usertext;

          // User text same as chatid
          listenNewMessage(usertext);

          clearButtonListen(chatid);
          quitButtonListen(chatid);
          postMessageListen(chatid);
        }

      })
    })

}, false);