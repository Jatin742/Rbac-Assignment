import React, { Fragment, useEffect } from 'react'
import "./Home.css";
import EventCard from './EventCard';
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getEvents } from '../../Actions/eventAction';
import Loader from "../Loader/Loader"

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, events} = useSelector(state => state.events);

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
    }
    dispatch(getEvents());
  }, [dispatch, error]);

  return (
    <Fragment>
    {loading? <Loader />:
    <Fragment>
      <h1>Welcome to the Events!</h1>
      <div className="container">
        {
          events && events.map(event => (
            <EventCard event={event} key={event.title} />
          ))}
      </div>
    </Fragment>
    }
  </Fragment>
  )
}

export default Home