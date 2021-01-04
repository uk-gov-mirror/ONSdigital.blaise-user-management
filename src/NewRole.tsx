import React, {useEffect, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {isDevEnv} from "./Functions";
import {ONSButton} from "./Components/ONSButton";
import {ONSTextInput} from "./Components/ONSTextInput";


function NewRole() {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [redirect, setRedirect] = useState<boolean>(false);

    function createNewUser() {
        if (name === "") {
            setMessage("Name cannot be blank");
            return;
        }

        if (description === "") {
            setMessage("Description cannot be blank");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);

        setButtonLoading(true);
        fetch("/api/roles", {
            "method": "POST",
            "body": formData,
        },)
            .then((r: Response) => {
                if (r.status === 200) {
                    r.json()
                        .then((json) => {
                                console.log("Retrieved users list, " + json.length + " items/s");
                                isDevEnv() && console.log(json);
                                setButtonLoading(false);
                                setMessage(json.toString);
                                setRedirect(true);
                                return;
                            }
                        ).catch(() => {
                        console.error("Unable to read json from response");
                        setMessage("Create role failed");
                        setButtonLoading(false);
                    });
                } else {
                    console.error("Failed to retrieve instrument list, status " + r.status);
                    setMessage("Create role failed");
                    setButtonLoading(false);
                }
            }).catch(() => {
                console.error("Failed to retrieve instrument list");
                setMessage("Create role failed");
                setButtonLoading(false);
            }
        );
    }

    useEffect(() => {
        console.log(":)");
    }, []);


    return (
        <>
            {
                redirect && <Redirect to={{
                    pathname: "/",
                    state: {updatedPanel: {visible: true, message: "Role " + name + " created", status: "success"} }
                }}/>
            }
            <p>
                <Link to={"/"}>Previous</Link>
            </p>
            <h1>Create new role</h1>
            <p>
                {message}
            </p>
            <form onSubmit={() => createNewUser()}>
                <ONSTextInput label={"Name"}
                              autoFocus={true}
                              value={name}
                              onChange={(e) => setName(e.target.value)}/>
                <ONSTextInput label={"Description"}
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}/>
                <ONSButton
                    label={"Save"}
                    primary={true}
                    loading={buttonLoading}
                    onClick={() => createNewUser()}/>
            </form>


        </>
    );
}

export default NewRole;
