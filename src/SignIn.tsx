import React, {EventHandler, useState} from "react";
import {Link, Redirect, useParams, useLocation} from "react-router-dom";
import {ONSPasswordInput} from "./Components/ONSDesignSystem/ONSPasswordInput";
import {isDevEnv} from "./Functions";
import {ONSButton} from "./Components/ONSDesignSystem/ONSButton";
import {ONSTextInput} from "./Components/ONSDesignSystem/ONSTextInput";

interface Props {
    setAuthenticationToken: any
}

interface location {
    state: any
}

function SignIn(props: Props) {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [redirect, setRedirect] = useState<boolean>(false);

    const location = useLocation();


    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {from} = (location as location).state || { from: { pathname: "/" } };

    const {setAuthenticationToken} = props;

    function changePassword() {
        if (username === "") {
            setMessage("Passwords cannot be blank");
            return;
        }

        setButtonLoading(true);

        const yeah = true;

        if (yeah === true) {
            setButtonLoading(false);
            setMessage("Authentication successful");
            setAuthenticationToken("Auth");
            setRedirect(true);
        } else {
            setButtonLoading(false);
            setMessage("Authentication failed");
        }
    }


    return (
        <>
            {
                redirect && <Redirect to={from}/>
            }
            <h1>Sign in</h1>
            <p>
                {message}
            </p>
            <form onSubmit={() => changePassword()}>
                <ONSTextInput label={"Username"}
                              autoFocus={true}
                              value={username}
                              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setUsername(e.target.value)}/>
                <ONSPasswordInput label={"Password"}
                                  value={password}
                                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}/>
                <ONSButton
                    label={"Sign in"}
                    primary={true}
                    loading={buttonLoading}
                    onClick={() => changePassword()}/>
            </form>


        </>
    );
}

export default SignIn;
