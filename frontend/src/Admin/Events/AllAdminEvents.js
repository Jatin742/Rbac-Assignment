import React, { Fragment, useEffect } from 'react'
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, deleteEvent, getAdminEvents } from "../../Actions/eventAction";
import { formattedDate } from '../../Components/Home/EventCard';
import { useNavigate } from 'react-router-dom';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import "./AllAdminEvents.css";
import { useAlert } from 'react-alert';
import { DELETE_EVENT_RESET } from '../../Constants/eventConstant';

const AllAdminEvents = () => {
    const { events, error } = useSelector(state => state.events);
    const { event, isDeleted } = useSelector(state => state.event);
    const alert = useAlert();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleNavigate = (url) => {
        navigate(url);
    }
    const deleteEventHandler = (id) => {
        dispatch(deleteEvent(id));
    }
    useEffect(() => {
        if(isDeleted){
            alert.success("Event Deleted");
            dispatch({ type: DELETE_EVENT_RESET });
            navigate("/admin/all-events");
        }
        dispatch(getAdminEvents());
    }, [dispatch, event, alert, isDeleted]);

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
        }
    }, [error, dispatch]);
    const columns = [
        { field: "title", headerName: "Event Name", minWidth: 175, flex: 0.4 },
        { field: "timingOfEvent", headerName: "Date", minWidth: 175, flex: 0.4 },
        { field: "numberOfRegisterations", headerName: "Number Of Registerations", minWidth: 200, flex: 1, type: "number" },
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
                            <div onClick={ () => handleNavigate(`/admin/event/${params.row.id}`) }>
                                <MdEdit />
                            </div>
                            <div onClick={() => deleteEventHandler(params.row.id)}>
                                <MdDelete />
                            </div>
                        </div>
                    </Fragment>
                );
            },
        },];
    const rows = [];
    events && events.forEach((item) => {
        rows.push({
            id: item._id,
            title: item.title,
            timingOfEvent: formattedDate(item.timingOfEvent),
            numberOfRegisterations: item.numberOfRegisterations,
        })
    });
    const handleEventCreation = () => {
        navigate('/admin/create-event');
    };
    return (
        <Fragment>
            <div style={{ overflowX: "auto", }} >
                <div className="headerContainer">
                    <h1>All Events</h1>
                    <button className="navigateButton" onClick={handleEventCreation}>Create Event</button>
                </div>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    autoHeight
                    className='eventListTable'
                />
            </div>
        </Fragment>
    )
}

export default AllAdminEvents