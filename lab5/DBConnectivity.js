window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
    window.alert("Your browser doesn't support IndexedDB");
}

var request = window.indexedDB.open("usersDatabase");
var db;

request.onsuccess = function (event) {
    db = request.result;
    console.log("Success: " + db);
}

request.onupgradeneeded = function (event) {
    // The database did not previously exist, so create object stores and indexes.
    var db = request.result;
    var userInformations = db.createObjectStore("users", {keyPath: "id"});
    var emailIndex = userInformations.createIndex("by_email", "email", {unique: true});
    var nameIndex = userInformations.createIndex("by_name", "name");
    var surnameIndex = userInformations.createIndex("by_surname", "surname");

    // Populate with initial data.
    userInformations.put({
        email: "jsmith@gmail.com",
        name: "John",
        surname: "Smith"
    });

    userInformations.put({
        email: "jkowalski@gmail.com",
        name: "Jan",
        surname: "Kowalski"
    });

    userInformations.put({
        email: "djanicki@gmail.com",
        name: "Damian",
        surname: "Janicki"
    });
};


function add() {
    var request = db.transaction("users", "readwrite").objectStore("users").add({
        email: "secondemail@gmail.com",
        name: "John",
        surname: "Smith"
    });

    request.onsuccess = function (event) {
        alert("added to db");
    }

    request.onerror = function (event) {
        alert("ADD ERROR");
    }
}

function read() {
    var transaction = db.transaction(["users"]);
    var objectStore = transaction.objectStore("users");
    var request = objectStore.get(1);

    request.onerror = function (event) {
        alert("Couldn't retrieve data");
    }

    request.onsuccess = function (event) {
        if(request.result){
            alert("Users: " + request.result.name + request.result.surname);
        }
        else{
            alert("Couldn't find user in the DB");
        }
    }
}

//
// db.onerror = function (event) {
//     // Generic error handler for all errors targeted at this database's
//     // requests!
//     console.error("Database error: " + event.target.errorCode);
// };

