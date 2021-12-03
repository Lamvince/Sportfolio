// hides top navbar icons and display logo if logged out
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

// populates top three cards in rank.html using the template TopTEmplate
function rankTopThree() {
    let TopTemplate = document.getElementById("TopTemplate");
    var count = 1;
    // reads from database and sorts by rank descending order
    // get top three users only
    db.collection("users").orderBy("rank", "desc").limit(3).get()
        .then(allUsers => {
            allUsers.forEach(doc => {
                var name = doc.data().name;
                var team = doc.data().team;
                var rank = doc.data().rank;
                var image = doc.data().userpfp;
                let newcard = TopTemplate.content.cloneNode(true);

                //update name, team, rank and profile pic
                newcard.querySelector('.top').innerHTML = "#" + count;
                newcard.querySelector('.img').src = image;
                newcard.querySelector('.name').innerHTML = name;
                newcard.querySelector('.team').innerHTML = team;
                newcard.querySelector('.score').innerHTML = "Rank Score: " + rank;

                document.getElementById("top"+count).appendChild(newcard);
                count++;
            })
        })
}

// populates cards after top three in rank.html using the template CardTemplate
function displayRank() {
    let CardTemplate = document.getElementById("CardTemplate");
    var count = 1;

    // reads from database and sorts by rank descending order
    // skips top three user
    db.collection("users").orderBy("rank", "desc").get()
        .then(allUsers => {
            allUsers.forEach(doc => {
                var name = doc.data().name;
                var team = doc.data().team;
                var rank = doc.data().rank;
                var image = doc.data().userpfp;
                let newcard = CardTemplate.content.cloneNode(true);

                //update name, team, rank and profile pic
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

// queries database filtering with where() to match search query with user name an displays result
// puts result into template and makes template card clickable
function getSearchResults() {
    let CardTemplate = document.getElementById("SearchTemplate");

    // assigns user input into "input"
    let input = document.getElementById("search_query").value.toLowerCase();
    var count = 1;

    // reads from database using where to match user query to lowerCaseName field
    db.collection("users").where('lowerCaseName', '>=', input).where('lowerCaseName', '<=', input + '\uf8ff').get()
        .then((snapshot) => {
            snapshot.docs.forEach(doc => {
                var name = doc.data().name;
                var team = doc.data().team;
                var sport = doc.data().sport;
                var image = doc.data().userpfp;
                let newcard = CardTemplate.content.cloneNode(true);

                //update name, team, rank and profile pic
                newcard.querySelector('.img').src = image;
                newcard.querySelector('.name').innerHTML = name;
                newcard.querySelector('.team').innerHTML = team;
                newcard.querySelector('.sport').innerHTML = sport;
                newcard.querySelector('.searchResult').setAttribute("id", count);

                document.getElementById("result-here").appendChild(newcard);

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

    // reads user with user id that matches parsed url
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


// Signs out user from authentication and returns them to landing page
function logout() {
      firebase.auth().signOut().then(() => {
          console.log("Logged out");
          window.location.href = "index.html";
      });
  }

// Show or hide an element. Used for hamburger menu
// param: id of the item being hidden or shown
function showOrHide(id) {
    var x = document.getElementById(id);
    if (x.style.display === "block") {
      x.style = "display: none !important";
    } else {
      x.style = "display: block !important";
    }
}