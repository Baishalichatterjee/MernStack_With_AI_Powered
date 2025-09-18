import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });
  const [editingEventId, setEditingEventId] = useState(null);
  const token = localStorage.getItem('token');

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/students", {
        headers: { 'x-access-token': token },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchEvents();
  }, [token]);

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEventId) {
        await axios.put(`http://localhost:5000/api/auth/events/${editingEventId}`, newEvent, {
          headers: { 'x-access-token': token }
        });
        setEditingEventId(null);
      } else {
        await axios.post("http://localhost:5000/api/auth/events", newEvent, {
          headers: { 'x-access-token': token }
        });
      }
      setNewEvent({ title: '', date: '', description: '' });
      fetchEvents();
    } catch (error) {
      console.error("Error adding/updating event:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/events/${id}`, {
        headers: { 'x-access-token': token }
      });
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const startEdit = (event) => {
    setNewEvent({ title: event.title, date: event.date, description: event.description });
    setEditingEventId(event._id);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Events Management */}
      <div className="events-management">
        <h2>Manage Events</h2>
        <form onSubmit={handleAddEvent}>
          <div className="form-group">
            <label htmlFor="title">Event Title:</label>
            <input type="text" name="title" value={newEvent.title} onChange={handleEventChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="date">Event Date:</label>
            <input type="date" name="date" value={newEvent.date} onChange={handleEventChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Event Description:</label>
            <textarea name="description" value={newEvent.description} onChange={handleEventChange} required />
          </div>
          <button type="submit" className="view-details-btn">{editingEventId ? 'Update Event' : 'Add Event'}</button>
          {editingEventId && <button type="button" className="back-btn" onClick={() => setEditingEventId(null)}>Cancel</button>}
        </form>

        <div className="events-list">
          <h3>Existing Events</h3>
          <div className="events-container">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                <h3>{event.title}</h3>
                <p>Date: {event.date}</p>
                <p>{event.description}</p>
                <div className="flex justify-around gap-2 mt-4">
                  <button onClick={() => startEdit(event)} className="view-details-btn">Edit</button>
                  <button onClick={() => handleDeleteEvent(event._id)} className="back-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="my-8 border-t border-gray-700" />

      {/* Students List */}
      <div className="students-list">
        <h2>Registered Students</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Club</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.roll}</td>
                <td>{student.department}</td>
                <td>{student.phone}</td>
                <td>{student.email}</td>
                <td>{student.club}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
