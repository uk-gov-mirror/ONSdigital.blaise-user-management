import React, {ReactElement, useEffect} from "react";
import {Link} from "react-router-dom";
import {Role, User} from "../../Interfaces";
import {useLocation} from "react-router-dom";
import {ExternalLink, ONSErrorPanel} from "blaise-design-system-react-components";

interface Props {
    list: Role[],
    listError: string
}


interface location {
    state: any
}

function RoleList(props: Props): ReactElement {
    const {list, listError} = props;
    const {state}: location = useLocation();

    return <>
        <p>
            <Link to={"/"}>Previous</Link>
        </p>
        <h1 className="u-mt-m">Roles</h1>

        <ul className="list list--bare list--inline ">
            <li className="list__item ">
                <Link to={"/role"}>
                    Create new role
                </Link>
            </li>
        </ul>

        {listError.includes("Unable") && <ONSErrorPanel/>}

        <table id="user-table" className="table u-mt-m">
            <thead className="table__head u-mt-m">
            <tr className="table__row">
                <th scope="col" className="table__header ">
                    <span>Name</span>
                </th>
                <th scope="col" className="table__header ">
                    <span>Description</span>
                </th>
                <th scope="col" className="table__header ">
                    <span>Number of permissions</span>
                </th>
                <th scope="col" className="table__header ">
                    <span>Edit role</span>
                </th>
                <th scope="col" className="table__header ">
                    <span>Delete role</span>
                </th>

            </tr>
            </thead>
            <tbody className="table__body">
            {
                list && list.length > 0
                    ?
                    list.map((item: Role) => {
                        return (
                            <tr className="table__row" key={item.name} data-testid={"user-table-row"}>
                                <td className="table__cell ">
                                    {item.name}
                                </td>
                                <td className="table__cell ">
                                    {item.description}
                                </td>
                                <td className="table__cell ">
                                    {item.permissions.length}
                                </td>
                                <td className="table__cell ">
                                    <Link to={"/survey/" + item.name}>Edit</Link>
                                </td>
                                <td className="table__cell ">
                                    <Link to={"/role/delete/" + item.name}>Delete</Link>
                                </td>

                            </tr>
                        );
                    })
                    :
                    <tr>
                        <td className="table__cell " colSpan={6}>
                            {listError}
                        </td>
                    </tr>
            }
            </tbody>
        </table>
    </>;
}

export default RoleList;
