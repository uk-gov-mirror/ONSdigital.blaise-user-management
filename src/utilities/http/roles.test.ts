import {cleanup} from "@testing-library/react";
import {mock_server_request_function, mock_server_request_Return_JSON} from "../../tests/utils";
import {getAllRoles} from "./roles";
import {Role} from "../../../Interfaces";

const roleList: Role[] = [
    {name: "DST", permissions: ["Admin", "Bacon.access"], description: "A role"},
    {name: "BDSS", permissions: ["Admin"], description: "Another role"}
];

describe("Function getAllUsers(filename: string) ", () => {

    it("It should return true with data if the list is returned successfully", async () => {
        mock_server_request_Return_JSON(200, roleList);
        const [success, roles] = await getAllRoles();
        expect(success).toBeTruthy();
        expect(roles).toEqual(roleList);
    });

    it("It should return true with an empty list if a 404 is returned from the server", async () => {
        mock_server_request_Return_JSON(404, []);
        const [success, roles] = await getAllRoles();
        expect(success).toBeTruthy();
        expect(roles).toEqual([]);
    });

    it("It should return false with an empty list if request returns an error code", async () => {
        mock_server_request_Return_JSON(500, {});
        const [success, roles] = await getAllRoles();
        expect(success).toBeFalsy();
        expect(roles).toEqual([]);
    });

    it("It should return false with an empty list if request JSON is not a list", async () => {
        mock_server_request_function(jest.fn(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.reject("Failed"),
            })
        ));
        const [success, roles] = await getAllRoles();
        expect(success).toBeFalsy();
        expect(roles).toEqual([]);
    });

    it("It should return false with an empty list if request JSON is invalid", async () => {
        mock_server_request_Return_JSON(200, {name: "NAME"});
        const [success, roles] = await getAllRoles();
        expect(success).toBeFalsy();
        expect(roles).toEqual([]);
    });

    it("It should return false with an empty list if request call fails", async () => {
        mock_server_request_function(jest.fn(() =>
            Promise.resolve(() => {
                throw "error";
            })
        ));
        const [success, roles] = await getAllRoles();
        expect(success).toBeFalsy();
        expect(roles).toEqual([]);
    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});
