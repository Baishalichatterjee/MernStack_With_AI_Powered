import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const StudentForm = ({ clubs }) => {
  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    department: "",
    phone: "",
    email: "",
    club: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'student') {
      setMessage("Please log in as a student to join a club.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/submit-student", formData, {
        headers: { 'x-access-token': token }
      });
      setMessage(response.data.message);
      setFormData({
        name: "",
        roll: "",
        department: "",
        phone: "",
        email: "",
        club: "",
      });
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(`Error: ${err.response.data.error}`);
      } else {
        setMessage("Error: An unexpected error occurred.");
      }
      console.error("Form submission error:", err);
    }
  };

  return (
    <div className="login-container">
      <h2>Join a Club</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="roll">Roll Number:</label>
          <input
            type="text"
            id="roll"
            name="roll"
            value={formData.roll}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="club">Select Club:</label>
          <select
            id="club"
            name="club"
            value={formData.club}
            onChange={handleChange}
            required
          >
            <option value="">--Select a Club--</option>
            {clubs.map((club) => (
              <option key={club.name} value={club.name}>
                {club.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="view-details-btn">Submit</button>
      </form>
      {message && <p className={`form-container-message ${message.startsWith('Error') ? 'error-message' : ''}`}>{message}</p>}
    </div>
  );
};

export default StudentForm;
