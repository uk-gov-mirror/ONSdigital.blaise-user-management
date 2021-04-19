import React, {ReactElement, useEffect, useState} from "react";
import {Role} from "../../Interfaces";
import {ErrorBoundary} from "../Components/ErrorHandling/ErrorBoundary";
import {getAllRoles} from "../utilities/http";
import {ONSPanel} from "blaise-design-system-react-components";
import RoleList from "../Components/RoleList";

interface Panel {
    visible: boolean
    message: string
    status: string
}

function Roles(): ReactElement {
    const [panel, setPanel] = useState<Panel>({visible: false, message: "", status: "info"});

    const updatePanel = (visible = false, message = "", status = "info") => {
        setPanel(
            {visible: visible, message: message, status: status}
        );
    };

    const [roles, setRoles] = useState<Role[]>([]);
    const [listError, setListError] = useState<string>("Loading ...");


    useEffect(() => {
        getRolesList().then(() => console.log("Call getRolesList Complete"));
    }, []);

    async function getRolesList() {
        setRoles([]);

        const [success, roleList] = await getAllRoles();

        if (!success) {
            setListError("Unable to load roles.");
            return;
        }

        console.log(roleList);

        if (roleList.length === 0) {
            setListError("No roles found.");
        }

        setRoles(roleList);
    }


    return (
        <>

            <ONSPanel hidden={!panel.visible} status={panel.status}>
                <p>{panel.message}</p>
            </ONSPanel>
            <ErrorBoundary errorMessageText={"Unable to load role table correctly."}>
                <RoleList list={roles}
                          listError={listError}/>
            </ErrorBoundary>
        </>
    );
}

export default Roles;
