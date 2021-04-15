import React from "react";
import {render, waitFor, cleanup, screen} from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";
import flushPromises, {loginUser, mock_server_request_Return_JSON} from "./tests/utils";
import {act} from "react-dom/test-utils";
import {createMemoryHistory} from "history";
import {Router} from "react-router";
import {User} from "../Interfaces";

const userListReturned: User[] = [
    {
        defaultServerPark: "gusty",
        name: "TestUser123",
        role: "DST",
        serverParks: ["gusty"]
    }
];

describe("React homepage", () => {

    beforeAll(() => {
        mock_server_request_Return_JSON(200, userListReturned);
    });


    it("view users page matches Snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <App/>
            </Router>
        );

        await loginUser();

        await act(async () => {
            await flushPromises();
        });


        await act(async () => {
            await flushPromises();
        });

        await waitFor(() => {
            expect(wrapper).toMatchSnapshot();
        });
    });

    it("view users page matches Snapshot", async () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <App/>
            </Router>
        );

        await loginUser();

        await act(async () => {
            await flushPromises();
        });

        await act(async () => {
            await flushPromises();
        });

        await waitFor(() => {
            expect(wrapper).toMatchSnapshot();
        });

    });

    it("should render correctly", async () => {
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <App/>
            </Router>
        );
        expect(screen.getByText(/Blaise User Management/i)).toBeDefined();

        await loginUser();

        await act(async () => {
            await flushPromises();
        });

        await waitFor(() => {
            expect(screen.getByText(/Blaise User Management/i)).toBeDefined();
            expect(screen.getByText(/Manage users/i)).toBeDefined();
            expect(screen.getByText(/Manage roles/i)).toBeDefined();
            expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
        });
    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
});


// describe("Given the API returns malformed json", () => {
//
//     beforeAll(() => {
//         mock_server_request_Return_JSON(200, {text: "Hello"});
//     });
//
//     it("it should render with the error message displayed", async () => {
//         const history = createMemoryHistory();
//         const {getByText, queryByText} = render(
//             <Router history={history}>
//                 <App/>
//             </Router>
//         );
//
//         await loginUser();
//
//         await act(async () => {
//             await flushPromises();
//         });
//
//
//         await waitFor(() => {
//             expect(getByText(/Sorry, there is a problem with this service. We are working to fix the problem. Please try again later./i)).toBeDefined();
//             expect(queryByText(/Loading/i)).not.toBeInTheDocument();
//         });
//
//     });
//
//     afterAll(() => {
//         jest.clearAllMocks();
//         cleanup();
//     });
// });
//
// describe("Given the API returns an empty list", () => {
//
//     beforeAll(() => {
//         mock_server_request_Return_JSON(200, []);
//     });
//
//     it("it should render with a message to inform the user in the list", async () => {
//         const history = createMemoryHistory();
//         const {getByText, queryByText} = render(
//             <Router history={history}>
//                 <App/>
//             </Router>
//         );
//
//         await loginUser();
//
//         await act(async () => {
//             await flushPromises();
//         });
//
//
//         await waitFor(() => {
//             expect(getByText(/No installed users found./i)).toBeDefined();
//             expect(queryByText(/Loading/i)).not.toBeInTheDocument();
//         });
//
//     });
//
//     afterAll(() => {
//         jest.clearAllMocks();
//         cleanup();
//     });
// });
