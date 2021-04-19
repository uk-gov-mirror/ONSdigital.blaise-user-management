import {requestPromiseJsonList} from "./requestPromise";
import {Role} from "../../../Interfaces";

type getRolesListResponse = [boolean, Role[]];

function getAllRoles(): Promise<getRolesListResponse> {
    console.log("Call to getAllRoles");
    const url = "/api/roles";

    return new Promise((resolve: (object: getRolesListResponse) => void) => {
        requestPromiseJsonList("GET", url).then(([success, data]) => {
            console.log(`Response from get all roles ${(success ? "successful" : "failed")}, data list length ${data.length}`);
            resolve([success, data]);
        }).catch((error: Error) => {
            console.error(`Response from get all roles Failed: Error ${error}`);
            resolve([false, []]);
        });
    });
}

export {getAllRoles};
