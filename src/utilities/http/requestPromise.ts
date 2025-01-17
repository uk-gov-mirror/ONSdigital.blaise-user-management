type PromiseResponse = [number, any];

function requestPromiseJson(method: string, url: string, body: any = null): Promise<PromiseResponse> {
    console.log(body);
    return new Promise((resolve: (object: PromiseResponse) => void, reject: (error: string) => void) => {
        fetch(url, {
            "method": method,
            "body": body
        })
            .then(async response => {
                response.json().then(
                    data => (resolve([response.status, data]))
                ).catch((error) => {
                    console.log(`Failed to read JSON from response, Error: ${error}`);
                    resolve([response.status, "Read JSON failed"]);
                });
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

export {requestPromiseJson};
