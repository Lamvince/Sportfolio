console.log("hello world");

var queryString = decodeURIComponent(window.location.search);
var queries = queryString.split("?");
var uid = queries[1];
console.log("HERE " + uid);