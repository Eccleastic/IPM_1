/*
      QueryableWorker instances methods:
        * sendQuery(queryable function name, argument to pass 1, argument to pass 2, etc. etc): calls a Worker's queryable function
        * postMessage(string or JSON Data): see Worker.prototype.postMessage()
        * terminate(): terminates the Worker
        * addListener(name, function): adds a listener
        * removeListener(name): removes a listener
      QueryableWorker instances properties:
        * defaultListener: the default listener executed only when the Worker calls the postMessage() function directly
     */

var w;

function startWorker(){
    console.log("1");
    w = new Worker("Worker.js");
    const preJSONData = {
        email: document.getElementById("email").value,
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        phone: document.getElementById("phone").value,
        idNumber: document.getElementById("idNumber").value,
        postalCode: document.getElementById("kod_pocztowy").value,
        city: document.getElementById("city").value
    };

    w.postMessage(JSON.stringify(preJSONData))
    console.log("2");
    w.addEventListener('message', updateFormData);
    console.log("3");
}

function updateFormData(event){
    var parsedData = JSON.parse(event.data);
    console.log("7");
    console.log(event.data);
    console.log(parsedData);
    document.getElementById("email").value = parsedData['email'];
    document.getElementById("name").value = parsedData['name'];
    document.getElementById("surname").value = parsedData['surname'];
    document.getElementById("phone").value = parsedData['phone'];
    document.getElementById("idNumber").value = parsedData['idNumber'];
    document.getElementById("kod_pocztowy").value = parsedData['postalCode'];
    document.getElementById("city").value = parsedData['city'];
    stopWorker();
    console.log("8");
}
// document.getElementById("changeLetters").onclick = function (event) {
//
// };

function stopWorker() {
    w.terminate();
    w = undefined;
}
