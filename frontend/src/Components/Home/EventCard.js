import React from 'react'
import { Link } from 'react-router-dom'

export function formattedDate(date) {
  const d=new Date(date);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

const EventCard = ({event}) => {
  
  return (
    <Link className='eventCard' to={`/event/${event._id}`}>
      <img className='image' src={event.image} alt={event.title} />
      <div className="card-box">
          <p className='eventName'>{event.title}</p>
          <p className='eventDate'>{formattedDate(event.timingOfEvent)}</p>
      </div>
      <p className='registrations'>{event.numberOfRegistrations} registerations</p>
    </Link>
  )
}

export default EventCard