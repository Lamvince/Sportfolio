function insertPageData() {
  let files = [];

  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
      // Do something for the current logged-in user here: 
      console.log(user.uid);
      //go to the correct user document by referencing to the user uid
      let currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUser.get()
        .then(userDoc => {
          let user_Name = userDoc.data().name;
          let user_sport = userDoc.data().sport;
          let user_team = userDoc.data().team;
          let user_gender = userDoc.data().gender;
          let user_text = userDoc.data().description;
          let user_rank = userDoc.data().rank;
          let user_role = userDoc.data().role;

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

          //insert user info with html 
          document.getElementById("user-name").innerText = user_Name;
          document.getElementById("user-sport").innerText = user_sport;
          document.getElementById("user-team").innerText = user_team;
          document.getElementById("user-gender").innerText = user_gender;
          document.getElementById("user-description").innerHTML = user_text;
          document.getElementById("user-rank").innerText = user_rank;
          document.getElementById("user-role").innerText = user_role;

          //hide or show appropriate buttons
          for (var i = 1; i <= 3; i++) {
            //hide photo/video upload button every time on load
            document.getElementById("photoupload" + i).style.display = "none";
            document.getElementById("videoupload" + i).style.display = "none";

            //hide profile upload button every time on load
            document.getElementById("btn_upload_profile").style.display = "none";

            //hide delete photo button if needed
            if (imgText[i - 1] == "./images/tempimg.png") {
              document.getElementById("delete" + i).style.display = "none";
            }

            //hide delete video button if needed
            if (vidText[i - 1] == null) {
              document.getElementById("deletevideo" + i).style.display = "none";
            }

          }

          //edit profile photo
          document.getElementById("btn_edit_profile").onclick = function (e) {
            let input = document.createElement('input');
            input.type = 'file';

            input.onchange = e => {
              files = e.target.files;
              let reader = new FileReader();
              reader.onload = function () {
                document.getElementById("profile_pic").src = reader.result;
              }
              // show upload button
              document.getElementById("btn_upload_profile").style.display = "block";
              reader.readAsDataURL(files[0]);
            }
            input.click();
          }

          // upload profile picture
          document.getElementById("btn_upload_profile").onclick = function () {
            let imgName = user_Name + files[0].name;
            let uploadTask = firebase.storage().ref('images/' + imgName).put(files[0]);

            uploadTask.on('state_changed', function (snapshot) {
              let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              document.getElementById("profile_photo_load_progress").innerHTML = 'Upload' + progress + '%';
            },

              function (error) {
                alert('error in saving the image');
              },

              function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (url) {

                  db.collection("users").doc(user.uid).update({
                    name: user.displayName,
                    email: user.email,
                    image: imgName,
                    userpfp: url
                  });
                  alert('image added successfully');
                  document.getElementById("profile_photo_load_progress").style.display = "none";
                  document.getElementById("btn_upload_profile").style.display = "none";
                })
              }

            );
          }

          let read = db.collection("users").doc(user.uid);

          read.get()
            .then(userDoc => {
              document.getElementById("profile_pic").src = userDoc.data().userpfp;

              document.getElementById("img1").src = userDoc.data().img1;
              document.getElementById("img2").src = userDoc.data().img2;
              document.getElementById("img3").src = userDoc.data().img3;

              document.getElementById("vid1src").src = userDoc.data().uservid1;
              document.getElementById("uservideo1").src = userDoc.data().uservid1;
              document.getElementById("vid2src").src = userDoc.data().uservid2;
              document.getElementById("uservideo2").src = userDoc.data().uservid2;
              document.getElementById("vid3src").src = userDoc.data().uservid3;
              document.getElementById("uservideo3").src = userDoc.data().uservid3;
            })

          //SET UP ONCLICK FOR EDIT PROFILE PHOTO

          document


          //SET UP ONCLICKS FOR ADD PHOTO BUTTONS
          for (var i = 1; i <= 3; i++) {
            let idString = "upload" + i;
            document.getElementById(idString).onclick = function (e) {
              let input = document.createElement('input');
              input.type = 'file';

              input.onchange = e => {
                files = e.target.files;
                let reader = new FileReader();

                reader.onload = function () {
                  let imgString = "img" + idString.charAt(6); //img1, img2, img3
                  let buttonString = "photoupload" + idString.charAt(6);

                  document.getElementById(imgString).src = reader.result;

                  //show upload photo button
                  document.getElementById(buttonString).style.display = "block";

                }
                reader.readAsDataURL(files[0]);
              }
              input.click();
            }
          }

          //SET UP ONCLICKS FOR UPLOAD PHOTO BUTTONS
          for (var i = 1; i <= 3; i++) {
            let idString = "photoupload" + i;
            document.getElementById(idString).onclick = function () {

              let imgName = user_Name + files[0].name;
              let uploadTask = firebase.storage().ref('pics/' + imgName).put(files[0]);

              uploadTask.on('state_changed', function (snapshot) {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              },

                function (error) {
                  alert('error in saving the image');
                },

                function () {
                  uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
                    let imgString = "img" + idString.charAt(11); //img 1, img2, img3

                    db.collection("users").doc(user.uid).update({
                      [imgString]: url
                    });

                    alert('image added successfully');
                    //hide upload button, show delete button
                    document.getElementById("photoupload" + idString.charAt(11)).style.display = "none";
                    document.getElementById("delete" + idString.charAt(11)).style.display = "block";

                    //increase rank by 5
                    db.collection("users").doc(user.uid).update({
                      rank: userDoc.data().rank + 5
                    });

                    document.getElementById("user-rank").innerText = userDoc.data().rank + 5;

                  })
                }
              );
            }
          }

          //SET UP ONCLICKS FOR PHOTO DELETE BUTTONS
          for (var i = 1; i <= 3; i++) {
            let idString = "delete" + i;
            document.getElementById(idString).addEventListener("click", function (e) {
              e.preventDefault();
              let imgString = "img" + idString.charAt(6);
              document.getElementById(imgString).src = "./images/tempimg.png";

              let userUID = db.collection("users").doc(user.uid);
              let removeImg1 = userUID.update({
                [imgString]: "./images/tempimg.png"
              });

              //hide delete button
              document.getElementById("delete" + idString.charAt(6)).style.display = "none";
            }, false);
          }

          //SET UP ONCLICKS FOR ADD NEW VIDEO BUTTONS
          for (var i = 1; i <= 3; i++) {
            let idString = "uploadvideo" + i;

            document.getElementById(idString).onclick = function (e) {

              let input = document.createElement('input');
              input.type = 'file';


              input.onchange = e => {
                files = e.target.files;
                let reader = new FileReader();

                reader.onload = function () {
                  let num = idString.charAt(11);
                  document.getElementById("uservideo" + num).src = reader.result;
                  document.getElementById("vid" + num + "src").src = reader.result;

                  //show upload video button
                  document.getElementById("videoupload" + num).style.display = "block";
                }

                reader.readAsDataURL(files[0]);
              }
              input.click();
            }

          }

          //SET UP ONCLICKS FOR VIDEO UPLOAD BUTTONS
          for (var i = 1; i <= 3; i++) {
            let idString = "videoupload" + i;
            document.getElementById(idString).onclick = function () {
              let imgName = user_Name + files[0].name;
              let uploadTask = firebase.storage().ref('videos/' + imgName).put(files[0]);

              uploadTask.on('state_changed', function (snapshot) {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              },

                function (error) {
                  alert('error in saving the video');
                },

                function () {
                  uploadTask.snapshot.ref.getDownloadURL().then(function (url) {

                    let vidString = "uservid" + idString.charAt(11);
                    db.collection("users").doc(user.uid).update({
                      [vidString]: url
                    });
                    alert('video added successfully');

                    //hide upload button, show delete button
                    document.getElementById("videoupload" + idString.charAt(11)).style.display = "none";
                    document.getElementById("deletevideo" + idString.charAt(11)).style.display = "block";

                    //increase rank by 5
                    db.collection("users").doc(user.uid).update({
                      rank: userDoc.data().rank + 5
                    });

                    document.getElementById("user-rank").innerText = userDoc.data().rank + 5;
                  })
                }

              );
            }
          }

          //SET UP ONCLICKS FOR DELETE VIDEO BUTTONS
          for (var i = 1; i <= 3; i++) {
            let idString = "deletevideo" + i;
            document.getElementById(idString).addEventListener("click", function (e) {
              e.preventDefault();

              idString = "uservideo" + idString.charAt(11);
              document.getElementById(idString).src = "";

              idString = "uservid" + idString.charAt(9);
              let read = db.collection("users").doc(user.uid);

              let removeVideo = read.update({
                [idString]: firebase.firestore.FieldValue.delete(),
              });

              //hide delete button
              document.getElementById("deletevideo" + idString.charAt(7)).style.display = "none";

            }, false);
          }

          // Save the description text
          document.getElementById("savetext").addEventListener("click", function (e) {
            e.preventDefault();

            let usertext = document.getElementById("user-description").innerHTML;
            console.log(usertext);
            db.collection("users").doc(user.uid).update({
              description: usertext
            });

          }, false);

        })

    } else {
      // No user is signed in.
    }
  });
}
insertPageData();