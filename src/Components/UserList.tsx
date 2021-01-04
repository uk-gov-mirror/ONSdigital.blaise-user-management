import React, {ReactElement, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {User} from "../../Interfaces";
import {ONSPanel} from "./ONSPanel";
import {useLocation} from "react-router-dom";
import ONSErrorPanel from "./ONSDesignSystem/ONSErrorPanel";
import {DefaultErrorBoundary} from "./ErrorHandling/DefaultErrorBoundary";
import ExternalLink from "./ONSDesignSystem/ExternalLink";

interface listError {
    error: boolean,
    message: string
}

interface Props {
    list: User[],
    listError: listError
    getUsers: any
    externalCATIUrl: string
    updatePanel: any
    panel: Panel
}

interface Panel {
    visible: boolean
    message: string
    status: string
}


interface location {
    state: any
}

function UserList(props: Props): ReactElement {
    const {list, listError, getUsers, externalCATIUrl, updatePanel, panel} = props;
    const {state}: location = useLocation();
    const {updatedPanel} = state || {updatedPanel: null};
    useEffect(() => {
        if (updatedPanel === null) {
            return;
        }
        if (updatedPanel.message !== panel.message) {
            updatePanel(updatedPanel.visible, updatedPanel.message, updatedPanel.status);
            getUsers();
        }

    }, []);


    return <>
        <h1 className="u-mt-m">Users</h1>
        <p className="u-mt-m">
            <Link to={"/user"}>
                Create new user
            </Link>
        </p>
        <p className="u-mt-m">
            <ExternalLink text={"Link to CATI dashboard"}
                          link={externalCATIUrl}
                          id={"cati-dashboard"}/>
        </p>
        {listError.error && <ONSErrorPanel/>}

        <table id="user-table" className="table u-mt-m">
            <thead className="table__head u-mt-m">
            <tr className="table__row">
                <th scope="col" className="table__header ">
                    <span>Name</span>
                </th>
                <th scope="col" className="table__header ">
                    <span>Role</span>
                </th>
                <th scope="col" className="table__header ">
                    <span>Default server park</span>
                </th>
                <th scope="col" className="table__header ">
                    <span>Edit user</span>
                </th>
                <th scope="col" className="table__header ">
                    <span>Change password</span>
                </th>
                <th scope="col" className="table__header ">
                    <span>Delete user</span>
                </th>
            </tr>
            </thead>
            <tbody className="table__body">
            {
                list && list.length > 0
                    ?
                    list.map((item: User) => {
                        return (
                            <tr className="table__row" key={item.name} data-testid={"user-table-row"}>
                                <td className="table__cell ">
                                    {item.name}
                                </td>
                                <td className="table__cell ">
                                    {item.role}
                                </td>
                                <td className="table__cell ">
                                    {item.defaultServerPark}
                                </td>
                                <td className="table__cell ">
                                    <Link to={"/survey/" + item.name}>Edit</Link>
                                </td>
                                <td className="table__cell ">
                                    <Link to={"/user/changepassword/" + item.name}>Change password</Link>
                                </td>
                                <td className="table__cell ">
                                    <Link to={"/user/delete/" + item.name}>Delete</Link>
                                </td>
                            </tr>
                        );
                    })
                    :
                    <tr>
                        <td className="table__cell " colSpan={3}>
                            {listError.message}
                        </td>
                    </tr>
            }
            </tbody>
        </table>
    </>;
}

export default UserList;
