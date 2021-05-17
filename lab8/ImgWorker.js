var lettersValue = 0;

var R = 0;
var G = 0;
var B = 0;

var dataToPost = {
    lettersValue: 0,
    R: 0,
    G: 0,
    B: 0
};

self.onmessage = function (JSONData) {
    var splitData = concatEverything(JSONData).split("");
    for (var c of splitData) {
        if (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122) {
            lettersValue += c.charCodeAt(0) - 96;
        } else if (c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90) {
            lettersValue += c.charCodeAt(0) - 64 + 30;
        }
    }
    console.log(lettersValue)
    R = lettersValue % 255;
    G = 255 - (lettersValue % 255);
    if (R * 0.5 > 125) {
        B = 99;
    } else {
        B = 199;
    }

    dataToPost.lettersValue = lettersValue;
    dataToPost.R = R;
    dataToPost.G = G;
    dataToPost.B = B;

    self.postMessage(JSON.stringify(dataToPost));
}

function concatEverything(JSONData) {
    var parsedData = JSON.parse(JSONData.data);
    var concatedData = parsedData.imgLink + parsedData.email + parsedData.name + parsedData.surname + parsedData.phone + parsedData.idNumber + parsedData.postalCode + parsedData.city;
    return concatedData;
}
