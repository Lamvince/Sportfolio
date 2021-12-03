function logoHeader() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Hamburger menu and search icons appear in top navbar. 
            document.getElementById('logo').style = "display: none !important";
        } else {
            // Logo in top navbar.
            document.getElementById('logo').style= "display: block !important";
            const icons = document.getElementsByClassName('material-icons-outlined');
            for (var i = 0; i < icons.length; i++){
                icons[i].style = 'display: none !important';
            }
        }
    });
}

function rankTopThree() {
    var count = 1;
    db.collection("users").orderBy("rank", "desc").limit(3).get()
        .then(allUsers => {
            allUsers.forEach(doc => {
                var name = doc.data().name;
                var team = doc.data().team;
                var rank = doc.data().rank;
                var image = doc.data().userpfp;
                document.getElementById("top"+count).innerHTML = "<h5 class='card-title text-center pt-3 pb-2'>#" 
                + count + "</h5><img src=" + image + " class='card-img-top mx-auto' id='profile_pic'><div class='card-body text-center'><h5 class='card-title'>" 
                + name +"</h5><br><p class='card-text'>" + team + "</p><p class='card-text'>Rank Score: " + rank + "</p></div>";
                count++;
            })
        })
}

function displayRank() {
    let CardTemplate = document.getElementById("CardTemplate");
    var count = 1;
    db.collection("users").orderBy("rank", "desc").get()
        .then(allUsers => {
            allUsers.forEach(doc => {
                var name = doc.data().name;
                var team = doc.data().team;
                var rank = doc.data().rank;
                var image = doc.data().userpfp;
                let newcard = CardTemplate.content.cloneNode(true);

                //update title and text and image
                newcard.querySelector('.img').src = image;
                newcard.querySelector('.rank-name').innerHTML = "#" + count + ": " + name;
                newcard.querySelector('.team').innerHTML = team;
                newcard.querySelector('.score').innerHTML = "Rank Score: " + rank;

                if(count >= 4) {
                    document.getElementById("rank-here").appendChild(newcard);
                }
                count++;
            })
        })
}

function getSearchResults() {
    let input = document.getElementById("search_query").value.toLowerCase();
    var count = 1;

    while(count<=10){
        document.getElementById(count).innerHTML = "";
        count++;
    }
    count = 1;

    db.collection("users").where('lowerCaseName', '>=', input).where('lowerCaseName', '<=', input + '\uf8ff').get()
        .then((snapshot) => {
            snapshot.docs.forEach(doc => {
                var name = doc.data().name;
                var image = doc.data().userpfp;
                var sport = doc.data().sport;
                console.log(name);
                console.log(`${doc.id}`);
                document.getElementById(count).innerHTML = "<div class='card-header border-0'><img id='profile_pic' src="+image+"></div><div class='card-block px-2'><h4 class='card-title'>"+name+"</h4><p class='card-text'>"+sport+"</p></div>";

                //add click event for name
                document.getElementById(count).onclick = function() {
                    console.log("clicked!");
                    window.location.href = "visitprofile.html?uid=" + `${doc.id}`;
                }
                count++;
            })
        })
}

// Loads visited profile
function loadVisit() {
    //get the ID of user being visited
    let params = new URL(window.location.href);
    uid = params.searchParams.get("uid"); //parse "uid"
    db.collection("users").doc(uid)
          .get()
          .then(userDoc => {
              // get the documents of query
              var user_role = userDoc.data().role;
              var user_Name = userDoc.data().name;
              var user_sport = userDoc.data().sport;
              var user_team = userDoc.data().team;
              var user_gender = userDoc.data().gender;
              var user_text = userDoc.data().description;
              var user_rank = userDoc.data().rank;
    
              console.log("page loaded");
    
              //insert visited user info with html 
              document.getElementById("title").innerHTML = user_Name + "'s Profile";

              document.getElementById("visit-role").innerText = user_role;
              document.getElementById("visit-name").innerText = user_Name;
              document.getElementById("visit-sport").innerText = user_sport;
              document.getElementById("visit-team").innerText = user_team;
              document.getElementById("visit-gender").innerText = user_gender;
              if(user_text === "Click me to create a description!") {
                document.getElementById("visit-description").innerHTML = "";
              } else {
                document.getElementById("visit-description").innerHTML = user_text;
              }
              document.getElementById("visit-rank").innerText = user_rank;

              document.getElementById("visit_profile_pic").src = userDoc.data().userpfp;
              console.log("img is" + userDoc.data().userpfp);

              document.getElementById("visit-img1").src = userDoc.data().img1;
              document.getElementById("visit-img2").src = userDoc.data().img2;
              document.getElementById("visit-img3").src = userDoc.data().img3;

              document.getElementById("visit-vid1src").src = userDoc.data().uservid1;
              document.getElementById("visit-video1").src = userDoc.data().uservid1;
              document.getElementById("visit-vid2src").src = userDoc.data().uservid2;
              document.getElementById("visit-video2").src = userDoc.data().uservid2;
              document.getElementById("visit-vid3src").src = userDoc.data().uservid3;
              document.getElementById("visit-video3").src = userDoc.data().uservid3;
          })
}

function logout() {
      firebase.auth().signOut().then(() => {
          console.log("Logged out");
          window.location.href = "index.html";
      });
  }

function showOrHide(id) {
    var x = document.getElementById(id);
    if (x.style.display === "block") {
      x.style = "display: none !important";
    } else {
      x.style = "display: block !important";
    }
}