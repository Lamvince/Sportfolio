let uid;
var sender;

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
    alert("Your Chat ID is " + chatid +
      ". Pass this to your friend and enter the id into the box below and save it.");

  })
}
initChat();

//------------------------------------------------------
// This function allows the Logged in user post a message. 
// Will create a new doc with .add() to Firestore messsages
// subcollection for this chat.
//-------------------------------------------------------
function postMessageListen(chatid) {
  var textInput = document.getElementById("text");
  var postButton = document.getElementById("post");
  postButton.addEventListener("click", function () {
    var msgText = textInput.value; //user provided message
    firebase.auth().onAuthStateChanged(function (user) {
      db.collection('chats').doc(chatid).collection("messages")
        .add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          name: user.displayName,
          text: msgText,
          userid: user.uid
        })


      db.collection("users").doc(uid).update({
        noti: chatid,
        recentSender: sender
      });

    })
  });
}

//-------------------------------------------------------------
//This function clears the entire chat log.
//gets the messsages collection, and deletes each doc one by one
//in Firestore, and deletes the DOM of class name "msg" (see template)
//-------------------------------------------------------------
function clearButtonListen(chatid) {
  var clearButton = document.getElementById("clear");
  clearButton.addEventListener("click", function () {
    console.log("in clear function");
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

//--------------------------------------------------------------------
// When a new message doc has been added, let's display it.
// Use "onSnapshot()" to listen to changes.
// https://firebase.google.com/docs/firestore/query-data/listen.html#view_changes_between_snapshots
//--------------------------------------------------------------------
function listenNewMessage(chatid) {
  db.collection("chats").doc(chatid).collection("messages")
    .onSnapshot(snap => {
      snap.docChanges().forEach(change => {
        if (change.type == "added") {
          console.log("new message ", change.doc.data());
          let msgCard = document.getElementById("card-template")
            .content.cloneNode(true);
          msgCard.querySelector('.card-body').innerHTML = change.doc.data().text;
          msgCard.querySelector('.card-name').innerHTML = change.doc.data().name;
          document.getElementById("results").appendChild(msgCard);
        }
      })
    })
}


document.getElementById("savetext").addEventListener("click", function (e) {
  e.preventDefault();

  let usertext = document.getElementById("user-descriptions").innerHTML;

  usertext = usertext.trim();
  console.log(usertext);

  db.collection("chats").get()
    .then(snap => {
      snap.forEach(doc => {
        if (doc.id == usertext) {
          console.log(uid);
          console.log(doc.id);
          chatid = usertext;
          listenNewMessage(usertext);

          clearButtonListen(chatid);
          quitButtonListen(chatid);
          postMessageListen(chatid);
        }

      })
    })

}, false);