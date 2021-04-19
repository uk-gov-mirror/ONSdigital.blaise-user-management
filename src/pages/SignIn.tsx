import React, {ReactElement, useState} from "react";
import {Link, Redirect, useLocation} from "react-router-dom";
import {ONSButton, ONSPanel} from "blaise-design-system-react-components";
import FormTextInput from "../form/TextInput";
import Form from "../form";
import {requiredValidator} from "../form/FormValidators";
import {loginUser} from "../utilities/http";
import {User} from "../../Interfaces";


interface Props {
    setAuthenticatedUser: (user: User) => void
}

interface location {
    state: any
}

interface FormData {
    username: string
    password: string
}

function SignIn(props: Props): ReactElement {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [redirect, setRedirect] = useState<boolean>(false);

    const location = useLocation();

    const {from} = (location as location).state || {from: {pathname: "/"}};

    const {setAuthenticatedUser} = props;

    async function signIn(formData: FormData) {
        setButtonLoading(true);

        const [success, user] = await loginUser(formData.username, formData.password);

        if (!success) {
            setButtonLoading(false);
            setMessage("Unable to verify user credentials.");
            return;
        }

        if (user === null) {
            setButtonLoading(false);
            setMessage("Invalid username or password.");
            return;
        }

        setAuthenticatedUser(user);
        setRedirect(true);
    }

    function loginAnyway(){
        setAuthenticatedUser({defaultServerPark: "", name: "TEST_ENV", password: "", role: "", serverParks: []});
        setRedirect(true);
    }


    return (
        <>
            {
                redirect && <Redirect to={from}/>
            }
            <h1 className="u-mt-m">Sign in</h1>

            {/* TODO Remove the "Sign in anyway" as this just bypasses the Auth*/}
            {(message !== "" && <ONSPanel status={"error"}>{message} <Link to={"/"} onClick={loginAnyway}>Sign in anyway</Link> </ONSPanel>)}

            <Form onSubmit={(data) => signIn(data)}>

                <FormTextInput
                    name="username"
                    validators={[requiredValidator]}
                    label={"Username"}
                />

                <FormTextInput
                    data-testid="login-password-input"
                    name="password"
                    validators={[requiredValidator]}
                    label={"Password"}
                    password={true}
                />

                <div className="u-mt-s">
                    <ONSButton
                        label={"Sign in"}
                        testid={"sign-in"}
                        primary={true}
                        loading={buttonLoading}
                        submit={true}/>
                </div>
            </Form>
        </>
    );
}

export default SignIn;
