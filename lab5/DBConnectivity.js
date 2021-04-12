window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
    window.alert("Your browser doesn't support IndexedDB");
}

indexedDB.deleteDatabase("usersDatabase");

var request = window.indexedDB.open("usersDatabase");
var db;
let usersTable = document.getElementById("usersTable");

request.onsuccess = function (event) {
    db = request.result;
    console.log("Success: " + db);
    updateTable();
}

request.onupgradeneeded = function (event) {
    // The database did not previously exist, so create object stores and indexes.
    // var db = request.result;
    var userInformations = request.result.createObjectStore("users", {keyPath: "id", autoIncrement: true, unique: true});
    var emailIndex = userInformations.createIndex("by_email", "email");
    var nameIndex = userInformations.createIndex("by_name", "name");
    var surnameIndex = userInformations.createIndex("by_surname", "surname");
    var phoneIndex = userInformations.createIndex("by_phone", "phone");

    // Populate with initial data.
    userInformations.add({
        email: "jsmith@gmail.com",
        name: "John",
        surname: "Smith",
        phone: 123456789
    });

    userInformations.add({
        email: "jkowalski@gmail.com",
        name: "Jan",
        surname: "Kowalski",
        phone: 123123123
    });

    userInformations.add({
        email: "djanicki@gmail.com",
        name: "Damian",
        surname: "Janicki",
        phone: 943129643
    });
};

function add() {
    var email = document.getElementById("email").value;
    var name = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;
    var phonenumber = document.getElementById("phone").value;

    var transaction = db.transaction(["users"], "readwrite");
    var objectStore = transaction.objectStore("users");
    var request = objectStore.add({
        email: email,
        name: name,
        surname: surname,
        phonenumber: phonenumber
    });

    request.onsuccess = function (event) {
        console.log("Added: " + email + " " + name + surname + " " + phonenumber)
    }

    request.onerror = function (event) {
        alert("ADD ERROR");
    }

    updateTable();
}

function read() {
    var transaction = db.transaction(["users"]);
    var objectStore = transaction.objectStore("users");
    var request = objectStore.get(parseInt(document.getElementById("userid").value));

    request.onerror = function (event) {
        console.log("Couldn't retrieve data");
    }

    request.onsuccess = function (event) {
        if (request.result) {
            console.log("User: " + request.result.name + " " + request.result.surname + " ID:" + request.result.id + " Email: " + request.result.email);
        } else {
            console.log("Couldn't find user in the DB");
        }
    }
}

function updateTable() {
    var usersTable = document.getElementById("usersTable");
    var objectStore = db.transaction(["users"]).objectStore("users");
    usersTable.innerHTML = "";
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log("User: " + cursor.value.id + " " + cursor.value.name + " " + cursor.value.surname + " Email: " + cursor.value.email);
            usersTable.innerHTML += "<tr><td>" + cursor.value.id + "</td><td>" + cursor.value.name + "</td><td>" + cursor.value.surname + "</td><td>" + cursor.value.email + "</td><td>" + cursor.value.phonenumber + "</td></tr>"
            cursor.continue();
        } else {
            console.log("That's all.");
        }
    }
}
