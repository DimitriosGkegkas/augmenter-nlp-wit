import { WitToken } from "../secret";
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

export function Train(data: any) {
    var url = "https://api.wit.ai/utterances?v=20200513";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Authorization", "Bearer " + WitToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };

    xhr.send(JSON.stringify(data));
};

export function IntentAndTrain(name: string, data: any) {
    var url = "https://api.wit.ai/intents?v=20200513";
    var dataString = '{"name": "' + name + '"}';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Authorization", "Bearer " + WitToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            Train(data);
        }
    };

    xhr.send(dataString);
};
