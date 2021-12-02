import axios, { Method } from "axios";

export class Wit {
    url: (apiKey: string) => string = (apiKey: string) =>
        "https://api.wit.ai/" + apiKey + "?v=20200513";
    witToken: string;
    constructor(WitToken: string) {
        this.witToken = WitToken;
    }

    private async request(
        apiKey: string,
        options: {
            method: Method;
            data?: any;
            headers?: any;
            params?: string;
        }
    ) {
        options.headers = options.headers || {};
        options.headers["Accept"] = "application/json";
        options.headers["Content-Type"] = "application/json";
        options.headers["Authorization"] = "Bearer " + this.witToken;

        const requestURL: string =
            options.method === "GET" && options.params
                ? this.url(apiKey) + options.params
                : this.url(apiKey);

        return axios({ url: requestURL, ...options })
            .then(checkStatus)
            .then((data: any) => ({ data: data?.data }))
            .catch((err: any) => ({ err }));
    }

    public async Train(data: any) {
        const stats = await this.request("utterances", {
            method: "POST",
            data: JSON.stringify(data),
        });
        console.log(stats);
    }
    public async Meaning(message: string) {
        const stats = await this.request("message", {
            method: "GET",
            params: "&q=" + encodeURI(message),
        });
        console.log(stats);
    }
}

function checkStatus(response: any) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    throw error;
}
