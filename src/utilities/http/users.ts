import {requestPromiseJson} from "./requestPromise";
import {Instrument, User} from "../../../Interfaces";
type getUsersListResponse = [boolean, User[]];

function getAllUsers(): Promise<getUsersListResponse> {
    let list: User[] = [];
    console.log("Call to getAllUsers");
    const url = "/api/users";

    return new Promise((resolve: (object: getUsersListResponse) => void) => {
        requestPromiseJson("GET", url).then(([status, data]) => {
            console.log(`Response from get all users: Status ${status}, data ${data}`);
            if (status === 200) {
                if (!Array.isArray(data)) {
                    resolve([false, list]);
                }
                list = data;
                resolve([true, list]);
            } else if (status === 404) {
                resolve([true, list]);
            } else {
                resolve([false, list]);
            }
        }).catch((error: Error) => {
            console.error(`Response from get all users Failed: Error ${error}`);
            resolve([false, list]);
        });
    });
}

export {getAllUsers};
