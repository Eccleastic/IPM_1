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
        var newData = parseData[key];
            for (i = 0; i < newData.length; i++) {
                if (newData[i] == newData[i].toLowerCase()) {
                    newData[i] = newData[i].toUpperCase();
                } else {
                    newData[i] = newData[i].toLowerCase();
                }
            }
            changedData[key] = newData;
            console.log(newData)
        }
    );
    self.postMessage(JSON.stringify(changedData));
}

