import React, {ReactElement, useEffect, useState} from "react";
import Header from "./Components/ONSDesignSystem/Header";
import BetaBanner from "./Components/ONSDesignSystem/BetaBanner";
import ExternalLink from "./Components/ONSDesignSystem/ExternalLink";
import {DefaultErrorBoundary} from "./Components/ErrorHandling/DefaultErrorBoundary";
import Footer from "./Components/ONSDesignSystem/Footer";
import ONSErrorPanel from "./Components/ONSDesignSystem/ONSErrorPanel";
import {isDevEnv} from "./Functions";
import {
    Switch,
    Route,
    Link, Redirect
} from "react-router-dom";
import InstrumentList from "./Components/InstrumentList";
import UserList from "./Components/UserList";
import {User} from "../Interfaces";
import {ErrorBoundary} from "./Components/ErrorHandling/ErrorBoundary";
import NewUser from "./NewUser";
import ChangePassword from "./ChangePassword";
import DeleteUser from "./DeleteUser";
import SignIn from "./SignIn";
import {ONSPanel} from "./Components/ONSPanel";
import NewRole from "./NewRole";

interface Panel {
    visible: boolean
    message:string
    status: string
}

interface listError {
    error: boolean,
    message: string
}

interface window extends Window {
    VM_EXTERNAL_CLIENT_URL: string
    CATI_DASHBOARD_URL: string
}

const divStyle = {
    minHeight: "calc(67vh)"
};

function App(): ReactElement {

    const [externalClientUrl, setExternalClientUrl] = useState<string>("External URL should be here");
    const [externalCATIUrl, setExternalCATIUrl] = useState<string>("/Blaise");
    const [panel, setPanel] = useState<Panel>({visible: false, message: "", status: "info"});

    const updatePanel = (visible = false, message = "", status = "info") => {
        setPanel(
            {visible: visible, message: message, status: status}
        );
    };


    useEffect(function retrieveVariables() {
        setExternalClientUrl(isDevEnv() ?
            process.env.REACT_APP_VM_EXTERNAL_CLIENT_URL || externalClientUrl : (window as unknown as window).VM_EXTERNAL_CLIENT_URL);
        setExternalCATIUrl(isDevEnv() ?
            process.env.REACT_APP_CATI_DASHBOARD_URL || externalCATIUrl : (window as unknown as window).CATI_DASHBOARD_URL);
    }, [externalClientUrl, externalCATIUrl]);

    const [surveys, setSurveys] = useState<User[]>([]);
    const [listError, setListError] = useState<listError>({error: false, message: "Loading ..."});

    useEffect(() => {
        getList();
    }, []);

    const [authentication, setAuthentication] = useState(null);
    // A wrapper for <Route> that redirects to the login
    //screen if you're not yet authenticated.

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line react/prop-types
    function PrivateRoute({children, ...rest}) {
        return (
            <Route
                {...rest}
                render={({location}) =>
                    authentication !== null ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/signin",
                                state: {from: location}
                            }}
                        />
                    )
                }
            />
        );
    }

    function getList() {
        fetch("/api/users")
            .then((r: Response) => {
                if (r.status !== 200) {
                    throw r.status + " - " + r.statusText;
                }
                r.json()
                    .then((json: User[]) => {
                        if (!Array.isArray(json)) {
                            throw "Json response is not a list";
                        }
                        console.log("Retrieved instrument list, " + json.length + " items/s");
                        isDevEnv() && console.log(json);
                        setSurveys(json);
                        setListError({error: false, message: ""});

                        // If the list is empty then show this message in the list
                        if (json.length === 0) setListError({error: false, message: "No active surveys found."});
                    })
                    .catch((error) => {
                        isDevEnv() && console.error("Unable to read json from response, error: " + error);
                        setListError({error: true, message: "Unable to load surveys"});
                    });
            }).catch((error) => {
                isDevEnv() && console.error("Failed to retrieve instrument list, error: " + error);
                setListError({error: true, message: "Unable to load surveys"});
            }
        );
    }




    return (
        <>
            <BetaBanner/>
            <Header title={"Blaise User Management"}/>
            <div style={divStyle} className="page__container container">
                <main id="main-content" className="page__main">
                    <ONSPanel label={""} hidden={!panel.visible} status={panel.status}>
                        <p>{panel.message}</p>
                    </ONSPanel>
                    <DefaultErrorBoundary>
                        <Switch>
                            <PrivateRoute path={"/user/changepassword/:user"}>
                                <ChangePassword/>
                            </PrivateRoute>
                            <PrivateRoute path={"/user/delete/:user"}>
                                <DeleteUser/>
                            </PrivateRoute>
                            <PrivateRoute path={"/user"}>
                                <NewUser/>
                            </PrivateRoute>
                            <PrivateRoute path={"/role"}>
                                <NewRole/>
                            </PrivateRoute>
                            <Route path="/signin">
                                <ErrorBoundary errorMessageText={"Unable to load survey table correctly"}>
                                    <SignIn setAuthenticationToken={setAuthentication}/>
                                </ErrorBoundary>
                            </Route>
                            <PrivateRoute path="/">
                                <ErrorBoundary errorMessageText={"Unable to load survey table correctly"}>
                                    <UserList list={surveys}
                                              listError={listError}
                                              getUsers={getList}
                                              externalCATIUrl={externalCATIUrl}
                                              updatePanel={updatePanel}
                                              panel={panel}/>
                                </ErrorBoundary>
                            </PrivateRoute>
                        </Switch>
                    </DefaultErrorBoundary>
                </main>
            </div>
            <Footer external_client_url={externalClientUrl}/>
        </>
    );
}

export default App;
