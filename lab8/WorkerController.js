/*
      QueryableWorker instances methods:
        * sendQuery(queryable function name, argument to pass 1, argument to pass 2, etc. etc): calls a Worker's queryable function
        * postMessage(string or JSON Data): see Worker.prototype.postMessage()
        * terminate(): terminates the Worker
        * addListener(name, function): adds a listener
        * removeListener(name): removes a listener
      QueryableWorker instances properties:
        * defaultListener: the default listener executed only when the Worker calls the postMessage() function directly

        * komenda 'ws' odpala web server <- komentarz dla tworcy bo zapominam
 */


var letterWorker;
var imgWorker;


function startImgWorker() {
    imgWorker = new Worker("ImgWorker.js");
    const preJSONData = {
        imgLink: document.getElementById("imglink").value,
        email: document.getElementById("email").value,
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        phone: document.getElementById("phone").value,
        idNumber: document.getElementById("idNumber").value,
        postalCode: document.getElementById("kod_pocztowy").value,
        city: document.getElementById("city").value
    };
    imgWorker.postMessage(JSON.stringify(preJSONData));
    imgWorker.addEventListener('message', updateImage);
}

function updateImage(event) {
    var parsedData = JSON.parse(event.data);
    var imgLink = document.getElementById("imglink").value;
    console.log(parsedData.R);
    console.log(parsedData.G);
    console.log(parsedData.B);
    document.getElementById("filterColorTestRectangle").style.backgroundColor = 'rgb(' + parsedData.R + ', ' + parsedData.G + ' ,' + parsedData.B + ')';
    document.getElementById("calculatedValue").innerText = "Obliczona wartość to: " + parsedData.lettersValue;
    document.getElementById("calculatedValueR").innerText = "Wartość R: " + parsedData.R;
    document.getElementById("calculatedValueG").innerText = "Wartość G: " + parsedData.G;
    document.getElementById("calculatedValueB").innerText = "Wartość B: " + parsedData.B;
    var rgbvalue = 'rgb(' + parsedData.R + ', ' + parsedData.G + ' ,' + parsedData.B + ')';

    insertImgCanvas(imgLink, parsedData.R, parsedData.G, parsedData.B);
    stopWorker(imgWorker);
}

function insertImgCanvas(imgsrc, r, g, b) {
    var canvas = document.getElementById("scaledImage");
    var context = canvas.getContext('2d');

    var base_image = new Image();
    // base_image.crossOrigin = 'anonymous';
    base_image.src = imgsrc;
    base_image.onload = function () {
        context.width = 100;
        context.height = 100;
        context.drawImage(base_image, 0, 0, 100, 100);
        context.fillStyle = 'rgba(' + r + ',' + g + ',' + b +', 0.75)';
        context.fillRect(0,0, 20,20);
    }
}

function startLetterWorker() {
    letterWorker = new Worker("Worker.js");
    const preJSONData = {
        email: document.getElementById("email").value,
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        phone: document.getElementById("phone").value,
        idNumber: document.getElementById("idNumber").value,
        postalCode: document.getElementById("kod_pocztowy").value,
        city: document.getElementById("city").value
    };
    letterWorker.postMessage(JSON.stringify(preJSONData))
    letterWorker.addEventListener('message', updateFormData);
}

function updateFormData(event) {
    var parsedData = JSON.parse(event.data);
    console.log(event.data);
    document.getElementById("email").value = parsedData['email'];
    document.getElementById("name").value = parsedData['name'];
    document.getElementById("surname").value = parsedData['surname'];
    document.getElementById("phone").value = parsedData['phone'];
    document.getElementById("idNumber").value = parsedData['idNumber'];
    document.getElementById("kod_pocztowy").value = parsedData['postalCode'];
    document.getElementById("city").value = parsedData['city'];
    stopWorker(letterWorker);
}

function stopWorker(worker) {
    worker.terminate();
}
