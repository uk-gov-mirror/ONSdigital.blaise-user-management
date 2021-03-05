import React, {ChangeEvent, ReactElement, useEffect, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {ONSTextInput, ONSButton, ONSPasswordInput, ONSPanel} from "blaise-design-system-react-components";
import {addNewUser, getAllRoles} from "../utilities/http";
import {Role, User} from "../../Interfaces";


interface FormErrors {
    fieldID: string
    errorMessage: string
}

function NewUser(): ReactElement {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [redirect, setRedirect] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<FormErrors[]>([]);


    async function createNewUser() {
        console.log("Initialise createNewUser");
        await setFormErrors([]);
        const newFormErrors: FormErrors[] = [];

        if (username === "") {
            newFormErrors.push({fieldID: "username", errorMessage: "Username cannot be blank"});
        }

        if (password === "") {
            newFormErrors.push({fieldID: "password", errorMessage: "Password cannot be blank"});
        }

        if (confirmPassword === "") {
            newFormErrors.push({fieldID: "password", errorMessage: "Confirm password cannot be blank"});
        }

        if (password !== confirmPassword) {
            newFormErrors.push({fieldID: "password", errorMessage: "Passwords do not match"});
        }

        setFormErrors(newFormErrors);
        if (newFormErrors.length > 0) {
            return;
        }

        const newUser: User = {
            name: username,
            password: password,
            role: role,
            defaultServerPark: "gusty",
            serverParks: ["gusty"]
        };

        setButtonLoading(true);
        const created = await addNewUser(newUser);

        if (!created) {
            console.error("Failed to create new user");
            setMessage("Failed to create new user");
            setButtonLoading(false);
            return;
        }

        setButtonLoading(false);
        setRedirect(true);
    }

    useEffect(() => {
        getRoleList().then(() => console.log("Call getRoleList Complete"));
    }, []);

    const [roleList, setRoleList] = useState<Role[]>([]);
    const [listError, setListError] = useState<string>("");

    async function getRoleList() {
        setRoleList([]);

        const [success, roleList] = await getAllRoles();

        if (!success) {
            setListError("Unable to load roles");
            return;
        }

        if (roleList.length === 0) {
            setListError("No roles found.");
        }

        setRole(roleList[0].name);
        setRoleList(roleList);
    }

    return (
        <>
            {
                redirect && <Redirect to={{
                    pathname: "/",
                    state: {updatedPanel: {visible: true, message: "User " + username + " created", status: "success"}}
                }}/>
            }
            <p>
                <Link to={"/"}>Previous</Link>
            </p>
            <h1>Create a new user</h1>
            <ONSPanel hidden={(message === "")} status="error">
                {message}
            </ONSPanel>

            {
                formErrors.length > 0 &&
                <div aria-labelledby="error-summary-title" role="alert"
                     className="panel panel--error">
                    <div className="panel__header">
                        <h2 id="error-summary-title" data-qa="error-header" className="panel__title u-fs-r--b">There
                            are {formErrors.length} problems with your answer</h2>
                    </div>
                    <div className="panel__body">
                        <ol className="list">
                            {
                                formErrors.map(({fieldID, errorMessage}: FormErrors) => {
                                    return (
                                        <li key={fieldID} className="list__item ">
                                            <a href={`#${fieldID}`}
                                               className="list__link js-inpagelink">{errorMessage}</a>
                                        </li>
                                    );
                                })
                            }
                        </ol>
                    </div>
                </div>
            }


            <form className="u-mt-m" onSubmit={() => createNewUser()}>
                <ONSTextInput label={"Username"}
                              id={"username"}
                              autoFocus={true}
                              value={username}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}/>
                <ONSPasswordInput label={"Password"}
                                  value={password}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
                <ONSPasswordInput label={"Confirm password"}
                                  value={confirmPassword}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}/>
                <p className="field">
                    <label className="label" htmlFor="select">Role
                    </label>
                    <select value={role} id="role" name="select" className="input input--select "
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setRole(e.target.value)}>
                        {
                            roleList.map((option: Role) => {
                                return (<option key={option.name} value={option.name}>{option.name}</option>);
                            })
                        }
                    </select>
                </p>
                <ONSButton
                    label={"Save"}
                    primary={true}
                    loading={buttonLoading}
                    onClick={() => createNewUser()}/>
            </form>


        </>
    );
}

export default NewUser;
