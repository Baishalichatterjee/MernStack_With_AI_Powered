import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="events-page">
      <h1>College Events</h1>
      <div className="events-container">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <h3>{event.title}</h3>
            <p><strong>Date:</strong> {event.date}</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
      <Link to="/" className="back-btn">Back to Home</Link>
    </div>
  );
};

export default EventsPage;
