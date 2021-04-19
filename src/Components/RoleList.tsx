import React, {ReactElement, useEffect} from "react";
import {Link} from "react-router-dom";
import {Role, User} from "../../Interfaces";
import {useLocation} from "react-router-dom";
import {ExternalLink, ONSErrorPanel} from "blaise-design-system-react-components";

interface Props {
    list: Role[],
    listError: string
}

function RoleList(props: Props): ReactElement {
    const {list, listError} = props;

    return <>
        <p className="u-mt-m">
            <Link to={"/"}>Previous</Link>
        </p>
        <h1 className="u-mt-s">Manage roles</h1>

        <ul className="list list--bare list--inline ">
            <li className="list__item ">
                <Link to={"/roles/new"}>
                    Create new role
                </Link>
            </li>
        </ul>

        {listError.includes("Unable") && <ONSErrorPanel/>}

        {
            list && list.length > 0
                ?
                <table id="roles-table" className="table u-mt-m">
                    <thead className="table__head">
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
                        {/*<th scope="col" className="table__header ">*/}
                        {/*    <span>Edit role</span>*/}
                        {/*</th>*/}
                        {/*<th scope="col" className="table__header ">*/}
                        {/*    <span>Delete role</span>*/}
                        {/*</th>*/}
                    </tr>
                    </thead>
                    <tbody className="table__body">
                    {
                        list.map(({description, name, permissions}: Role) => {
                            return (
                                <tr className="table__row" key={name} data-testid={"user-table-row"}>
                                    <td className="table__cell ">
                                        {name}
                                    </td>
                                    <td className="table__cell ">
                                        {description}
                                    </td>
                                    <td className="table__cell ">
                                        {permissions.length}
                                    </td>
                                    {/*<td className="table__cell ">*/}
                                    {/*    <Link to={"/survey/" + item.name}>Edit</Link>*/}
                                    {/*</td>*/}
                                    {/*<td className="table__cell ">*/}
                                    {/*    <Link to={"/roles/delete/" + item.name}>Delete</Link>*/}
                                    {/*</td>*/}

                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
                :
                <div className="panel panel--info panel--no-title u-mb-m u-mt-m">
                    <div className="panel__body">
                        <p>{listError}</p>
                    </div>
                </div>
        }
    </>;
}

export default RoleList;
