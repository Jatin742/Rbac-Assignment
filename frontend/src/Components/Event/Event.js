import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./Event.css";
import { clearErrors, getEventDetails, registerForEvent } from '../../Actions/eventAction';
import Loader from '../Loader/Loader';
import { useAlert } from 'react-alert';
import { REGISTERATION_RESET } from '../../Constants/eventConstant';
import { formattedDate } from '../Home/EventCard';

const Event = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert=useAlert();
  const { event, loading, error } = useSelector(state => state.eventDetails);
  const { error: errorRegister, isRegistered } = useSelector(state => state.registeration);
  const handleRegisterClick = () => {
    dispatch(registerForEvent(id));
  };
  useEffect(()=>{
    dispatch(getEventDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error || errorRegister) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isRegistered) {
      alert.success("Registration successful!");
      dispatch({type: REGISTERATION_RESET});
    }
  }, [dispatch, error, errorRegister, isRegistered, alert]);

  return (<Fragment>

    {loading ? <Loader /> :
      <Fragment>
        <div className="eventContainer">
          <div className="eventImage">
            <img src={event.image} alt={event.name} />
          </div>
          <div className="eventDetails">
            <h1>{event.name}</h1>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Date:</strong> {formattedDate(event.timingOfEvent)}</p>
            <p><strong>{event.numberOfRegistrations} registrations</strong></p>
            <button className="registerButton" onClick={handleRegisterClick}>
              Register for Event
            </button>
          </div>
        </div>
      </Fragment>
    }
  </Fragment>
  );
};

export default Event;
