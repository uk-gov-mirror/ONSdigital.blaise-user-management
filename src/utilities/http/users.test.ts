import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {cleanup} from "@testing-library/react";
import {mock_server_request_function, mock_server_request_Return_JSON} from "../../tests/utils";
import {getAllUsers} from "./users";



describe("Function getAllUsers(filename: string) ", () => {
    Enzyme.configure({adapter: new Adapter()});

    it("It should return true with data if the list is returned successfully", async () => {
        mock_server_request_Return_JSON(200, []);
        const [success, users] = await getAllUsers();
        expect(success).toBeTruthy();
        expect(users).toEqual(users);
    });

    it("It should return true with an empty list if a 404 is returned from the server", async () => {
        mock_server_request_Return_JSON(404, []);
        const [success, users] = await getAllUsers();
        expect(success).toBeTruthy();
        expect(users).toEqual([]);
    });

    it("It should return false with an empty list if request returns an error code", async () => {
        mock_server_request_Return_JSON(500, {});
        const [success, users] = await getAllUsers();
        expect(success).toBeFalsy();
        expect(users).toEqual([]);
    });

    it("It should return false with an empty list if request JSON is not a list", async () => {
        mock_server_request_function(jest.fn(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.reject("Failed"),
            })
        ));
        const [success, users] = await getAllUsers();
        expect(success).toBeFalsy();
        expect(users).toEqual([]);
    });

    it("It should return false with an empty list if request JSON is invalid", async () => {
        mock_server_request_Return_JSON(200, {name: "NAME"});
        const [success, users] = await getAllUsers();
        expect(success).toBeFalsy();
        expect(users).toEqual([]);
    });

    it("It should return false with an empty list if request call fails", async () => {
        mock_server_request_function(jest.fn(() =>
            Promise.resolve(() => {
                throw "error";
            })
        ));
        const [success, users] = await getAllUsers();
        expect(success).toBeFalsy();
        expect(users).toEqual([]);
    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});
