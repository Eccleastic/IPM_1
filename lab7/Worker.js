var w;
var email = document.getElementById("email").value;
var name = document.getElementById("name").value;
var surname = document.getElementById("surname").value;
var phone = document.getElementById("phone").value;
var idNumber = document.getElementById("idNumber").value;
var postalCode = document.getElementById("kod_pocztowy").value;
var city = document.getElementById("city").value;

// var formData = [
//     email,
//     name,
//     surname,
//     phone,
//     idNumber,
//     postalCode,
//     city
// ];
var formData = JSON.stringify($("#myForm").serializeArray());



function startWorker() {
    console.log(formData);
    if (typeof (Worker) !== "undefined") {
        if (typeof (w) == "undefined") {
            w = new Worker("Worker.js");
        }
        for (i = 0; i < formData.length; i++) {
            var data = formData[i];
            for (j = 0; j < data.length; j++) {
                if (data[j] == data[j].toLowerCase()) {
                    newData[j] = data[j].toUpperCase();
                } else {
                    newData[j] = data[j].toLowerCase();
                }
            }
            formData[i] = newData;
        }
        email = formData[0];
        name = formData[1];
        surname = formData[2];
        phone = formData[3];
        idNumber = formData[4];
        postalCode = formData[5];
        city = formData[6];
    } else {
        document.getElementById("result").innerHTML = "Sorry! No Web Worker support.";
    }
}

function stopWorker() {
    w.terminate();
    w = undefined;
}
