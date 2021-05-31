window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

randomName = ["Jan", "Damian", "Piotr", "Lech", "Krzysztof", "Grzegorz", "Paweł", "Jacek"];
randomNameF = ["Telimena", "Anna", "Małgorzata", "Aleksandra", "Zofia", "Maria", "Magdalena"];
randomSurname = ["Kowalski", "Nowacki", "Piotrkowski", "Janicki", "Sobieski", "Bocian", "Soplica"];
randomSurnameF = ["Kowalska", "Nowacka", "Piotrkowska", "Janicka", "Sobieska", "Bocian", "Soplica"];
randomCity = ["Warszawa", "Kraków", "Poznań", "Łódź", "Wrocław", "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Białystok", "Katowice"];
const alphabet = "abcdefghijklmnopqrstuvwxyz";

var priceSum = 0;
var productsCount = 0;
var productsCart = [];

orderByField = "by_name";

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
    updateProductsTable();
}

request.onupgradeneeded = function (event) {
    // The database did not previously exist, so create object stores and indexes.
    // var db = request.result;
    var userInformations = request.result.createObjectStore("users", {
        keyPath: "id",
        autoIncrement: true,
        unique: true
    });
    var nameIndex = userInformations.createIndex("by_name", "name");
    var surnameIndex = userInformations.createIndex("by_surname", "surname");
    var idNumberIndex = userInformations.createIndex("by_idNumber", "idNumber");
    var postalCode = userInformations.createIndex("by_postalCode", "postalCode");
    var emailIndex = userInformations.createIndex("by_email", "email");
    var phoneIndex = userInformations.createIndex("by_phone", "phone");
    var cityIndex = userInformations.createIndex("by_city", "city");

    // Populate with initial data.
    userInformations.add({
        email: "jsmith@gmail.com",
        name: "John",
        surname: "Smith",
        phone: 123456789,
        idNumber: "ABC123456",
        postalCode: "12-345",
        city: "Łódź"
    });

    userInformations.add({
        email: "jkowalski@gmail.com",
        name: "Adam",
        surname: "Kowalski",
        phone: 123123123,
        idNumber: "XYZ654321",
        postalCode: "54-321",
        city: "Poznań"
    });

    userInformations.add({
        email: "djanicki@gmail.com",
        name: "Damian",
        surname: "Janicki",
        phone: 943129643,
        idNumber: "AQL693201",
        postalCode: "93-201",
        city: "Warszawa"
    });


    var productsInformation = request.result.createObjectStore("products", {
        keyPath: "id",
        autoIncrement: true,
        unique: true
    })
    var productName = productsInformation.createIndex("by_productName", "productName");
    var productPrice = productsInformation.createIndex("by_productPrice", "productPrice");
    var productManufacturer = productsInformation.createIndex("by_productManufacturer", "productManufacturer")
    var productDescription = productsInformation.createIndex("by_productDescription", "productDescription");

    productsInformation.add({
        productName: "Klawiatura",
        productPrice: 150,
        productManufacturer: "Lenovo",
        productDescription: "Ergonomiczna klawiatura na USB"
    });

    productsInformation.add({
        productName: "Monitor",
        productPrice: 500,
        productManufacturer: "Samsung",
        productDescription: "24 calowy monitor LED"
    });

    productsInformation.add({
        productName: "Myszka",
        productPrice: 100,
        productManufacturer: "Tracer",
        productDescription: "Bezprzewodowa myszka do komputera"
    });
};

function add() {
    var email = document.getElementById("email").value;
    var name = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;
    var phone = document.getElementById("phone").value;
    var idNumber = document.getElementById("idNumber").value;
    var postalCode = document.getElementById("kod_pocztowy").value;
    var city = document.getElementById("city").value;

    var transaction = db.transaction(["users"], "readwrite");
    var objectStore = transaction.objectStore("users");
    var request = objectStore.add({
        email: email,
        name: name,
        surname: surname,
        phone: phone,
        idNumber: idNumber,
        postalCode: postalCode,
        city: city
    });

    request.onsuccess = function (event) {
        console.log("Added: " + email + " " + name + surname + " " + phone)
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
    var userSelectDropDown = document.getElementById("buyerSelect");
    usersTable.innerHTML = "";
    userSelectDropDown.innerHTML = "";
    objectStore.index(orderByField).openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            // console.log("User: " + cursor.value.id + " " + cursor.value.name + " " + cursor.value.surname + " Email: " + cursor.value.email);
            usersTable.innerHTML +=
                "<tr><td >" + cursor.value.id + "</td><td id='email" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.email + "</td><td id='name" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.name + "</td><td id='surname" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.surname + "</td><td id='phone" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.phone + "</td><td id='idNumber" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.idNumber + "</td><td id='postalCode" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.postalCode + "</td><td id='city" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.city + "</td>"
                + "<td><button type=\"button\" onClick=\"deleteRecord(" + cursor.value.id + ")\">Delete</button>"
                + "<button type='button' onclick='edit(" + cursor.value.id + ")'>Potwierdz edycje</button> </td>"

            userSelectDropDown.innerHTML += "<option>" + cursor.value.name + " " + cursor.value.surname + "</option>";
            // userSelectDropDown.innerHTML += "<option value='" + cursor.value.id + cursor.value.surname + "'>" + cursor.value.id + " " + cursor.value.name + " " + cursor.value.surname + "</option>";
            cursor.continue();
        } else {
            // console.log("That's all.");
        }
    }
}

function updateProductsTable() {
    var productsTable = document.getElementById("productsTable");
    var objectStore = db.transaction(["products"]).objectStore("products");
    productsTable.innerHTML = "";
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            productsTable.innerHTML +=
                "<tr><td >" + cursor.value.id + "</td>" +
                "<td id='" + cursor.value.productName + "'>" + cursor.value.productName + "</td>" +
                "<td>" + cursor.value.productPrice + "</td>" +
                "<td>" + cursor.value.productDescription + "</td>" +
                "<td><button type='button' onclick='addToCart(" + cursor.value.id + ", " + cursor.value.productPrice + ", " + cursor.value.productName + ")'>Dodaj do koszyka </td>"
            cursor.continue();
        } else {
            // console.log("That's all.");
        }
    }
}

function orderBy(fieldName) {
    var usersTable = document.getElementById("usersTable");
    usersTable.innerHTML = "";
    orderByField += ", " + fieldName;
    console.log(orderByField);
    var transaction = db.transaction(["users"]);
    var objectStore = transaction.objectStore("users");
    var orderCursor = objectStore.index(fieldName).openCursor();
    orderCursor.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            usersTable.innerHTML +=
                "<tr><td >" + cursor.value.id + "</td><td id='email" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.email + "</td><td id='name" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.name + "</td><td id='surname" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.surname + "</td><td id='phone" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.phone + "</td><td id='idNumber" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.idNumber + "</td><td id='postalCode" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.postalCode + "</td><td id='city" + cursor.value.id + "' contenteditable='true'>"
                + cursor.value.city + "</td>"
                + "<td><button type=\"button\" onClick=\"deleteRecord(" + cursor.value.id + ")\">Delete</button>"
                + "<button type='button' onclick='edit(" + cursor.value.id + ")'>Potwierdz edycje</button> </td>"
            cursor.continue();
        } else {
            // console.log("That's all.");
        }
    }
    request.onerror = function (event) {
        console.log("Couldn't retrieve data");
    }

}

function edit(id) {
    var email = document.getElementById("email" + id).innerText;
    var name = document.getElementById("name" + id).innerText;
    var surname = document.getElementById("surname" + id).innerText;
    var phone = document.getElementById("phone" + id).innerText;
    var idNumber = document.getElementById("idNumber" + id).innerText;
    var postalCode = document.getElementById("postalCode" + id).innerText;
    var city = document.getElementById("city" + id).innerText;
    console.log(email + name + surname + phone + idNumber + postalCode + city);

    var transaction = db.transaction(["users"], "readwrite");
    var objectStore = transaction.objectStore("users");
    var request = objectStore.put({
        id: id,
        email: email,
        name: name,
        surname: surname,
        phone: phone,
        idNumber: idNumber,
        postalCode: postalCode,
        city: city
    });

    request.onsuccess = function (event) {
        console.log("Edited: " + email + " " + name + surname + " " + phone)
    }

    request.onerror = function (event) {
        alert("Edit ERROR");
    }

    updateTable();
}

function deleteRecord(user_ID) {
    var transaction = db.transaction(["users"], "readwrite");
    var objectStore = transaction.objectStore("users");
    var request = objectStore.delete(user_ID);
    request.onsuccess = function (event) {
        // It's gone!
        updateTable();
    };
}

function search() {
    var searchInput = document.getElementById("search").value.toLowerCase();
    if (searchInput != "") {
        var usersTable = document.getElementById("usersTable");
        usersTable.innerHTML = "";

        var objectStore = db.transaction(["users"]).objectStore("users");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (
                    cursor.value.email.toLowerCase().search(searchInput) > -1 ||
                    cursor.value.name.toLowerCase().search(searchInput) > -1 ||
                    cursor.value.surname.toLowerCase().search(searchInput) > -1 ||
                    cursor.value.idNumber.toLowerCase().search(searchInput) > -1 ||
                    cursor.value.postalCode.toLowerCase().search(searchInput) > -1 ||
                    cursor.value.city.toLowerCase().search(searchInput) > -1
                ) {
                    usersTable.innerHTML +=
                        "<tr><td >" + cursor.value.id + "</td><td id='email" + cursor.value.id + "' contenteditable='true'>"
                        + cursor.value.email + "</td><td id='name" + cursor.value.id + "' contenteditable='true'>"
                        + cursor.value.name + "</td><td id='surname" + cursor.value.id + "' contenteditable='true'>"
                        + cursor.value.surname + "</td><td id='phone" + cursor.value.id + "' contenteditable='true'>"
                        + cursor.value.phone + "</td><td id='idNumber" + cursor.value.id + "' contenteditable='true'>"
                        + cursor.value.idNumber + "</td><td id='postalCode" + cursor.value.id + "' contenteditable='true'>"
                        + cursor.value.postalCode + "</td><td id='city" + cursor.value.id + "' contenteditable='true'>"
                        + cursor.value.city + "</td>"
                        + "<td><button type=\"button\" onClick=\"deleteRecord(" + cursor.value.id + ")\">Delete</button>"
                        + "<button type='button' onclick='edit(" + cursor.value.id + ")'>Potwierdz edycje</button> </td>"
                    cursor.continue();
                } else {
                    cursor.continue();
                }
            } else {
                // console.log("That's all.");
            }
        }
    } else {
        updateTable();
    }
}

function randomChar(amount) {
    result = "";
    for (i = 0; i < amount; i++) {
        result += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return result.toUpperCase();
}

function generatePerson() {
    if (Math.floor(Math.random() * 2)) {
        name = randomName[Math.floor(Math.random() * 7)];
        surname = randomSurname[Math.floor(Math.random() * 7)];
        email = surname.toLowerCase() + name.substring(2) + "@gmail.com";
        phone = Math.random().toString().substring(2, 11);
        idNumber = randomChar(3) + Math.random().toString().substring(2, 8);
        postalCode = Math.random().toString().substring(2, 4) + "-" + Math.random().toString().substring(2, 5);
        city = randomCity[Math.floor(Math.random() * 11)];
        document.getElementById("name").value = name;
        document.getElementById("surname").value = surname;
        document.getElementById("email").value = email;
        document.getElementById("phone").value = phone;
        document.getElementById("idNumber").value = idNumber;
        document.getElementById("kod_pocztowy").value = postalCode;
        document.getElementById("city").value = city;
        // addToDB(email, name, surname, phone, idNumber, postalCode, city)
    } else {
        name = randomNameF[Math.floor(Math.random() * 7)];
        surname = randomSurnameF[Math.floor(Math.random() * 7)];
        email = surname.toLowerCase() + name.substring(2) + "@gmail.com";
        phone = Math.random().toString().substring(2, 11);
        idNumber = randomChar(3) + Math.random().toString().substring(2, 8);
        postalCode = Math.random().toString().substring(2, 4) + "-" + Math.random().toString().substring(2, 5);
        city = randomCity[Math.floor(Math.random() * 11)];
        document.getElementById("name").value = name;
        document.getElementById("surname").value = surname;
        document.getElementById("email").value = email;
        document.getElementById("phone").value = phone;
        document.getElementById("idNumber").value = idNumber;
        document.getElementById("kod_pocztowy").value = postalCode;
        document.getElementById("city").value = city;
        // addToDB(email, name, surname, phone, idNumber, postalCode, city)
    }
}

function addToDB(email, name, surname, phone, idNumber, postalCode, city) {
    var transaction = db.transaction(["users"], "readwrite");
    var objectStore = transaction.objectStore("users");
    var request = objectStore.add({
        email: email,
        name: name,
        surname: surname,
        phone: phone,
        idNumber: idNumber,
        postalCode: postalCode,
        city: city
    });

    request.onsuccess = function (event) {
        console.log("Added: " + email + " " + name + surname + " " + phone)
    }

    request.onerror = function (event) {
        alert("ADD ERROR");
    }

    updateTable();
}

function addToCart(productIndex, productPrice, productName) {
    priceSum += productPrice;
    productsCart[productsCount] = [productName, productPrice];
    productsCount += 1;
    document.getElementById("productsCount").innerText = "Ilosc produktów: " + productsCount;
    document.getElementById("price").innerText = "Do zapłaty: " + priceSum;
}

function generateInvoice() {
    invoiceTable = document.getElementById("faktura");
    pickedUser = document.getElementById("buyerSelect");

    invoiceTable.innerHTML = "<div>Kupujący: " + pickedUser.options[pickedUser.selectedIndex].value + "</div>" +
        "Produkty: <table><thead>" +
        "<tr><th>Produkt</th><th>Cena</th></tr>" +
        "</thead>";


    for (let i = 0; i < productsCart.length; i++) {
        invoiceTable.innerHTML += "<tr>"
            + "<td>" + productsCart[i][0] + "</td></tr>" +
            "<td>" + productsCart[i][1] + "</td>";
    }
    invoiceTable.innerHTML += "</tbody></table>";
}


















