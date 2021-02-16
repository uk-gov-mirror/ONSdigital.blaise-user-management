import {requestPromiseJson} from "./requestPromise";
import {Role} from "../../../Interfaces";
type getRolesListResponse = [boolean, Role[]];

function getAllRoles(): Promise<getRolesListResponse> {
    let list: Role[] = [];
    console.log("Call to getAllRoles");
    const url = "/api/roles";

    return new Promise((resolve: (object: getRolesListResponse) => void) => {
        requestPromiseJson("GET", url).then(([status, data]) => {
            console.log(`Response from get all roles: Status ${status}, data ${data}`);
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
            console.error(`Response from get all roles Failed: Error ${error}`);
            resolve([false, list]);
        });
    });
}

export {getAllRoles};
