import React, { Fragment, useEffect } from 'react'
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { formattedDate } from '../../Components/Home/EventCard';
import { getUserRegisteredEvents, clearErrors } from '../../Actions/userAction';
import Loader from '../Loader/Loader';

const MyEvents = () => {
    const { events, error, loading } = useSelector(state => state.userEvents);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserRegisteredEvents());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
        }
    }, [error, dispatch]);
    const columns = [
        { field: "title", headerName: "Event Name", minWidth: 175, flex: 0.4 },
        { field: "timingOfEvent", headerName: "Date", minWidth: 175, flex: 0.4 },
        { field: "numberOfRegisterations", headerName: "Number Of Registerations", minWidth: 350, flex: 1, type: "number" },];
    const rows = [];
    events && events.forEach((item) => {
        rows.push({
            id: item._id,
            title: item.title,
            timingOfEvent: formattedDate(item.timingOfEvent),
            numberOfRegisterations: item.numberOfRegisterations,
        })
    })
    return (
        <Fragment>
            {loading ? <Loader/>
            :
                <Fragment>
                <div style={{ overflowX: "auto", }} >
                    <h1>My Events</h1>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        autoHeight
                        />
                </div>
            </Fragment>
                    }
        </Fragment>
    )
}

export default MyEvents