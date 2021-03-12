import React, {ReactElement, useState} from "react";
import {Redirect, useLocation} from "react-router-dom";
import {ONSButton, ONSPanel} from "blaise-design-system-react-components";
import FormTextInput from "../form/TextInput";
import Form from "../form";
import {requiredValidator} from "../form/FormValidators";


interface Props {
    setAuthenticationToken: any
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

    const {setAuthenticationToken} = props;

    function signIn(formData: FormData) {

        setButtonLoading(true);

        const yeah = true;

        if (yeah === true) {
            setButtonLoading(false);
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

            {(message !== "" && <ONSPanel status={"error"}>{message}</ONSPanel>)}

            <Form onSubmit={(data) => signIn(data)}>
                <p className="field">
                    <FormTextInput
                        name="username"
                        validators={[requiredValidator]}
                        label={"Username"}
                    />
                </p>
                <p className="field">
                    <FormTextInput
                        name="password"
                        validators={[requiredValidator]}
                        label={"Password"}
                        password={true}
                    />
                </p>
                <ONSButton
                    label={"Sign in"}
                    primary={true}
                    loading={buttonLoading}
                    submit={true}/>
            </Form>
        </>
    );
}

export default SignIn;
