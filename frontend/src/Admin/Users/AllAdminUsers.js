import React, { Fragment, useEffect } from 'react'
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { formattedDate } from '../../Components/Home/EventCard';
import { useNavigate } from 'react-router-dom';
import "./AllAdminUsers.css";
import { getAllAdminUsers, clearErrors, deleteUser } from "../../Actions/adminAction";
import Loader from "../../Components/Loader/Loader";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { DELETE_USER_RESET } from '../../Constants/adminConstant';
import { useAlert } from 'react-alert';

const AllAdminUsers = () => {
    const { users, error, loading } = useSelector(state => state.allAdminUsers);
    const { isDeleted } = useSelector(state => state.adminUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();

    const handleNavigate = (url) => {
        navigate(url);
    }
    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    }
    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
        }
        if (isDeleted) {
            alert.success("User Deleted Successfully");
            navigate("/admin/all-users");
            dispatch({ type: DELETE_USER_RESET });
        }
        dispatch(getAllAdminUsers());
    }, [error, dispatch, isDeleted]);

    const columns = [
        { field: "name", headerName: "Name", minWidth: 175, flex: 0.4 },
        { field: "createdAt", headerName: "Date", minWidth: 175, flex: 0.4 },
        { field: "role", headerName: "Role", minWidth: 200, flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            type: "number",
            minWidth: 200,
            flex: 0.3,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <div className="action-icons">
                            <div onClick={() => handleNavigate(`/admin/user/${params.row.id}`)}>
                                <MdEdit />
                            </div>
                            <div onClick={() => deleteUserHandler(params.row.id)}>
                                <MdDelete />
                            </div>
                        </div>
                    </Fragment>
                );
            },
        },];
    const rows = [];
    users && users.forEach((item) => {
        rows.push({
            id: item._id,
            name: item.name,
            createdAt: formattedDate(item.createdAt),
            role: item.role
        })
    });
    const handleEventCreation = () => {
        navigate('/admin/create-user');
    };
    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <div style={{ overflowX: "auto", }} >
                        <div className="headerContainer">
                            <h1>All Users</h1>
                            <button className="navigateButton" onClick={handleEventCreation}>Create User</button>
                        </div>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            disableSelectionOnClick
                            autoHeight
                            className='userListTable'
                        />
                    </div>
                </Fragment>
            }
        </Fragment>
    )
}

export default AllAdminUsers