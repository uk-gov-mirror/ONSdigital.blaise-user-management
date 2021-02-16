import React, {useEffect, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {isDevEnv} from "../Functions";
import {ONSTextInput, ONSButton, ONSPasswordInput} from "blaise-design-system-react-components";
import {getAllRoles} from "../utilities/http";
import {Role} from "../../Interfaces";

interface listError {
    error: boolean,
    message: string
}

interface ServerPark {
    name: string
}


function NewUser() {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [serverPark, setServerPark] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [redirect, setRedirect] = useState<boolean>(false);

    function createNewUser() {
        if (username === "") {
            setMessage("Password cannot be blank");
            return;
        }
        if (password === "") {
            setMessage("Password cannot be blank");
            return;
        }
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        if (role === "") {
            setMessage("Role needs to be set");
            return;
        }

        if (serverPark === "") {
            setMessage("ServerPark needs to be set");
            return;
        }

        const newUSer = {
            "password": password,
            "name": username,
            "role": "string",
            "serverParks": [
                "string"
            ],
            "defaultServerPark": "string"
        };

        const formData = new FormData();
        formData.append("name", username);
        formData.append("password", password);
        formData.append("role", role);
        formData.append("serverParks", `['${serverPark}']`);
        formData.append("defaultServerPark", serverPark);
        // formData.append("role_id", role);

        setButtonLoading(true);
        fetch("/api/users", {
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
                        setMessage("Set password failed");
                        setButtonLoading(false);
                    });
                } else {
                    console.error("Failed to retrieve instrument list, status " + r.status);
                    setMessage("Set password failed");
                    setButtonLoading(false);
                }
            }).catch(() => {
                console.error("Failed to retrieve instrument list");
                setMessage("Set password failed");
                setButtonLoading(false);
            }
        );
    }

    useEffect(() => {
        getRoleList().then(() => console.log("Call getRoleList Complete"));
        getServerParkList();
    }, []);

    const [roleList, setRoleList] = useState<Role[]>([]);
    const [listError, setListError] = useState<string>("");
    const [serverParkList, setServerParkList] = useState<ServerPark[]>([]);
    const [serverParkListError, setServerParkListError] = useState<listError>({error: false, message: "Loading ..."});

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

        setRoleList(roleList);
    }

    function getServerParkList() {
        fetch("/api/serverparks", {})
            .then((r: Response) => {
                if (r.status === 200) {
                    r.json()
                        .then((json: ServerPark[]) => {
                                console.log("Retrieved serverparks list, " + json.length + " items/s");
                                isDevEnv() && console.log(json);
                                setServerParkList(json);
                                setServerPark(json[0].name);
                                setServerParkListError({error: false, message: ""});
                            }
                        ).catch(() => {
                        console.error("Unable to read json from response");
                        setServerParkListError({error: true, message: "Unable to load surveys"});
                    });
                } else {
                    console.error("Failed to retrieve instrument list, status " + r.status);
                    setServerParkListError({error: true, message: "Unable to load surveys"});
                }
            }).catch(() => {
                console.error("Failed to retrieve instrument list");
                setServerParkListError({error: true, message: "Unable to load surveys"});
            }
        );
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
            <h1>Create new user</h1>
            <p>
                {message}
            </p>
            <form onSubmit={() => createNewUser()}>
                <ONSTextInput autoFocus={true}
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}/>
                <ONSPasswordInput label={"Password"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}/>
                <ONSPasswordInput label={"Confirm password"}
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}/>
                <p className="field">
                    <label className="label" htmlFor="select">Role
                    </label>
                    <select value={role} id="select" name="select" className="input input--select "
                            onChange={(e) => setRole(e.target.value)}>
                        {
                            roleList.map((option: Role) => {
                                return (<option key={option.name} value={option.name}>{option.name}</option>);
                            })
                        }
                    </select>
                </p>
                <p className="field">
                    <label className="label" htmlFor="select">Server park
                    </label>
                    <select value={serverPark} id="select" name="select" className="input input--select "
                            onChange={(e) => setServerPark(e.target.value)}>
                        {
                            serverParkList.map((option: ServerPark) => {
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
