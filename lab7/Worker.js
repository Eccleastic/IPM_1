var changedData = {
    email: "",
    name: "",
    surname: "",
    phone: "",
    idNumber: "",
    postalCode: "",
    city: ""
};

self.onmessage = function (JSONData) {
    // var formData = JSON.stringify($("#myForm").serializeArray());
    console.log(JSONData.data);
    var parseData = JSON.parse(JSONData.data);
    Object.keys(parseData).forEach(function (key) {
        var newData = [];
            for (i = 0; i < parseData[key].length; i++) {
                if (parseData[key][i] == parseData[key][i].toLowerCase()) {
                    newData[i] = parseData[key][i].toUpperCase();
                } else {
                    newData[i] = parseData[key][i].toLowerCase();
                }
            }
            changedData[key] = newData.join("");
            console.log(newData)
        }
    );
    self.postMessage(JSON.stringify(changedData));
}

