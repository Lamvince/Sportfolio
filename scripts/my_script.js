function sayHello() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            console.log(user.uid);
            db.collection("users").doc(user.uid)
                .get()
                .then(function (doc) {
                    var n = doc.data().name;
                    console.log(n);
                    //$("#username").text(n);
                    document.getElementById("username").innerText = n;
                })
        } else {
            // No user is signed in.
        }
    });
}
//sayHello();

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


// Grabs profile pictures and adds them to Recommened Connections on main.html
function getProfilePic() {
    var count = 1;
    db.collection("users").get()
        .then(allUsers => {
            allUsers.forEach(doc => {
                var image = doc.data().userpfp;
                document.getElementById(count).innerHTML = "<img class='img-fluid' src=" + image + " alt=''>";
                count = count + 1;
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
                console.log(`UID ${doc.id}`);
                document.getElementById(count).innerHTML = "<div class='card-header border-0'><img id='profile_pic' src="+image+"></div><div class='card-block px-2'><h4 class='card-title'>"+name+"</h4><p class='card-text'>"+sport+"</p></div>";
                count++;
            })
        })
}

// Logout
function logout() {
    const logout = document.querySelectorAll("a[href='./index.html']");
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        firebase.auth().signOut().then(() => {
            console.log("Logged out");
        });
    });
}


function writeWebcamData() {
    //this is an array of JSON objects copied from open source data
    var webcams = [{
            "datasetid": "web-cam-url-links",
            "recordid": "01d6f80e6ee6e7f801d2b88ad7517bd05223e790",
            "fields": {
                "url": "http://images.drivebc.ca/bchighwaycam/pub/html/www/17.html",
                "geom": {
                    "type": "Point",
                    "coordinates": [
                        -123.136736007805,
                        49.2972589838826
                    ]
                },
                "mapid": "TCM015",
                "name": "Stanley Park Causeway"
            },
            "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
        },
        {
            "datasetid": "web-cam-url-links",
            "recordid": "d95ead494c2afbb5f47efdc26bf3ea8c6b8b2e22",
            "fields": {
                "url": "http://images.drivebc.ca/bchighwaycam/pub/html/www/20.html",
                "geom": {
                    "type": "Point",
                    "coordinates": [
                        -123.129968,
                        49.324891
                    ]
                },
                "mapid": "TCM017",
                "name": "North End 2"
            },
            "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
        },
        {
            "datasetid": "web-cam-url-links",
            "recordid": "8651b55b799cac55f9b74d654a88f3500b6acd64",
            "fields": {
                "url": "https://trafficcams.vancouver.ca/cambie49.htm",
                "geom": {
                    "type": "Point",
                    "coordinates": [
                        -123.116492357278,
                        49.2261139995231
                    ]
                },
                "mapid": "TCM024",
                "name": "Cambie St and W 49th Av",
                "geo_local_area": "Oakridge"
            },
            "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
        },
        {
            "datasetid": "web-cam-url-links",
            "recordid": "f66fa2c58d19e3f28cf8b842bfa1db073e32e71b",
            "fields": {
                "url": "https://trafficcams.vancouver.ca/cambie41.htm",
                "geom": {
                    "type": "Point",
                    "coordinates": [
                        -123.116192190431,
                        49.2335434721856
                    ]
                },
                "mapid": "TCM025",
                "name": "Cambie St and W 41st Av",
                "geo_local_area": "South Cambie"
            },
            "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
        },
        {
            "datasetid": "web-cam-url-links",
            "recordid": "7c3afe1d3fe4c80f24260a4946abea3fb15b7017",
            "fields": {
                "url": "https://trafficcams.vancouver.ca/cambie25.htm",
                "geom": {
                    "type": "Point",
                    "coordinates": [
                        -123.115406053889,
                        49.248990875309
                    ]
                },
                "mapid": "TCM026",
                "name": "Cambie St and W King Edward Av",
                "geo_local_area": "South Cambie"
            },
            "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
        },
        {
            "datasetid": "web-cam-url-links",
            "recordid": "7fea7df524a205c0c0eb8efcc273345356cbe8d1",
            "fields": {
                "url": "https://trafficcams.vancouver.ca/mainTerminal.htm",
                "geom": {
                    "type": "Point",
                    "coordinates": [
                        -123.100028035364,
                        49.2727762979223
                    ]
                },
                "mapid": "TCM028",
                "name": "Main St and Terminal Av",
                "geo_local_area": "Downtown"
            },
            "record_timestamp": "2021-03-22T10:32:40.391000+00:00"
        }
    ];

    webcams.forEach(function (cam) { //cycle thru json objects in array
        console.log(cam); //just to check it out
        db.collection("webcams").add(cam) //add this new document
            .then(function (doc) { //success 
                console.log("wrote to webcams collection " + doc.id);
            })
    })
}

function showOrHide(id) {
    var x = document.getElementById(id);
    if (x.style.display === "block") {
      x.style = "display: none !important";
    } else {
      x.style = "display: block !important";
    }
}