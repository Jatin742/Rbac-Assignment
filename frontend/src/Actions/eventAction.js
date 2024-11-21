import { ADMIN_EVENT_FAIL, ADMIN_EVENT_REQUEST, ADMIN_EVENT_SUCCESS, ALL_EVENT_FAIL, ALL_EVENT_REQUEST, ALL_EVENT_SUCCESS, CLEAR_ERRORS, DELETE_EVENT_FAIL, DELETE_EVENT_REQUEST, DELETE_EVENT_SUCCESS, EVENT_DETAILS_FAIL, EVENT_DETAILS_REQUEST, EVENT_DETAILS_SUCCESS, NEW_EVENT_FAIL, NEW_EVENT_REQUEST, NEW_EVENT_SUCCESS, REGISTERATION_FAIL, REGISTERATION_REQUEST, REGISTERATION_SUCCESS, UPDATE_EVENT_FAIL, UPDATE_EVENT_REQUEST, UPDATE_EVENT_SUCCESS} from "../Constants/eventConstant";
import axios from "axios";

const host=process.env.REACT_APP_BACKEND_HOST;
export const getEvents = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_EVENT_REQUEST });

        let link = `${host}/api/v1/events`;
        const { data } = await axios.get(link);
        dispatch({
            type: ALL_EVENT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ALL_EVENT_FAIL,
            payload: error.response.data.message,
        })
    }
}

export const createEvent = (eventData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_EVENT_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        };
        const { data } = await axios.post(`${host}/api/v1/admin/event/new`, eventData, config);
        dispatch({
            type: NEW_EVENT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: NEW_EVENT_FAIL,
            payload: error.response.data.message,
        })
    }
}

export const getEventDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: EVENT_DETAILS_REQUEST });

        const { data } = await axios.get(`${host}/api/v1/event/${id}`, {
            withCredentials: true
        });
        dispatch({
            type: EVENT_DETAILS_SUCCESS,
            payload: data.event,
        });
    } catch (error) {
        dispatch({
            type: EVENT_DETAILS_FAIL,
            payload: error.response.data.message,
        })
    }
}

export const getAdminEvents = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_EVENT_REQUEST });
        const { data } = await axios.get(`${host}/api/v1/admin/events`, { withCredentials: true });
        dispatch({
            type: ADMIN_EVENT_SUCCESS,
            payload: data.events,
        })
    } catch (error) {
        dispatch({
            type: ADMIN_EVENT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const registerForEvent = (id) => async (dispatch) =>{
    try {
        dispatch({type: REGISTERATION_REQUEST});
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        };
        const {data} = await axios.put(`${host}/api/v1/event/${id}`, {},config);
    
        dispatch({ 
            type: REGISTERATION_SUCCESS,
            payload: data.success
         });
      } catch (error) {
        dispatch({ type: REGISTERATION_FAIL, payload: error.response.data.message });
      }
}

export const updateEvent = (id, eventData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_EVENT_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        };
        const { data } = await axios.put(`${host}/api/v1/admin/event/${id}`, eventData, config);
        dispatch({
            type: UPDATE_EVENT_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_EVENT_FAIL,
            payload: error.response.data.message,
        })
    }
}

export const deleteEvent = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_EVENT_REQUEST });
        const { data } = await axios.delete(`${host}/api/v1/admin/event/${id}`, {
            withCredentials: true
        });
        dispatch({
            type: DELETE_EVENT_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: DELETE_EVENT_FAIL,
            payload: error.response.data.message,
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}