import React, {useEffect, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {ONSPasswordInput} from "./Components/ONSDesignSystem/ONSPasswordInput";
import {isDevEnv} from "./Functions";
import {ONSButton} from "./Components/ONSDesignSystem/ONSButton";
import {ONSTextInput} from "./Components/ONSDesignSystem/ONSTextInput";

interface listError {
    error: boolean,
    message: string
}

interface Option {
    description: string
    name: string
    permissions: string[]
}

interface ServerPark {
    name: string
}

interface Role {
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
        getRoleList();
        getServerParkList();
    }, []);

    const [list, setList] = useState<Role[]>([]);
    const [listError, setListError] = useState<listError>({error: false, message: "Loading ..."});
    const [serverParkList, setServerParkList] = useState<ServerPark[]>([]);
    const [serverParkListError, setServerParkListError] = useState<listError>({error: false, message: "Loading ..."});


    function getRoleList() {
        fetch("/api/roles", {
        })
            .then((r: Response) => {
                if (r.status === 200) {
                    r.json()
                        .then((json: Role[]) => {
                                console.log("Retrieved role list, " + json.length + " items/s");
                                isDevEnv() && console.log(json);
                                setList(json);
                                setListError({error: false, message: ""});
                                setRole(json[0].name);
                            }
                        ).catch(() => {
                        console.error("Unable to read json from response");
                        setListError({error: true, message: "Unable to load surveys"});
                    });
                } else {
                    console.error("Failed to retrieve instrument list, status " + r.status);
                    setListError({error: true, message: "Unable to load surveys"});
                }
            }).catch(() => {
                console.error("Failed to retrieve instrument list");
                setListError({error: true, message: "Unable to load surveys"});
            }
        );
    }

    function getServerParkList() {
        fetch("/api/serverparks", {
        })
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

    // function makeRoleOptionList(list: []) {
    //     let optionList: [] = []
    //
    //     console.log(list)
    //
    //     list.forEach((item: any) => {
    //         console.log(item)
    //         let name = {
    //             label: item.name,
    //             value: item.id,
    //             id: item.id
    //         }
    //         // @ts-ignore
    //         optionList.push(name)
    //     });
    //
    //     setOptionList(optionList)
    // }

    return (
        <>
            {
                redirect && <Redirect to={{
                    pathname: "/",
                    state: {updatedPanel: {visible: true, message: "User " + username + " created", status: "success"} }
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
                <ONSTextInput label={"Username"}
                              autoFocus={true}
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
                    <select value={role} id="select" name="select" className="input input--select " onChange={(e) => setRole(e.target.value)}>
                        {
                            list.map((option: Role) => {
                                return (<option key={option.name} value={option.name}>{option.name}</option>);
                            })
                        }
                    </select>
                </p>
                <p className="field">
                    <label className="label" htmlFor="select">Server park
                    </label>
                    <select value={serverPark} id="select" name="select" className="input input--select " onChange={(e) => setServerPark(e.target.value)}>
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
