import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import ClubCard from "./components/ClubCard";
import ClubDetails from "./components/ClubDetails";
import StudentForm from "./components/StudentForm";
import AdminDashboard from "./components/AdminDashboard";
import EventsPage from "./components/EventsPage";
import Chatbot from "./components/Chatbot";
import Login from "./components/Login";
import Register from "./components/Register";
import "./styles.css";

const clubs = [
  {
    name: "Coding Club",
    leader: "John Doe",
    faculty: "Prof. Smith",
    description: "A club for coding enthusiasts to learn and grow.",
  },
  {
    name: "Singing Club",
    leader: "Alice Johnson",
    faculty: "Prof. Richards",
    description: "For music lovers and aspiring singers. Join us to perform and improve your vocal skills.",
  },
  {
    name: "Dancing Club",
    leader: "James Brown",
    faculty: "Prof. Thompson",
    description: "A group for dance lovers. Whether you're into hip hop, ballet, or contemporary, there's a place for you here.",
  },
  {
    name: "Public Speaking Club",
    leader: "Sarah Lee",
    faculty: "Prof. Williams",
    description: "Improve your public speaking skills and gain confidence while speaking in front of others.",
  },
  {
    name: "Social Work Club",
    leader: "David Harris",
    faculty: "Prof. Wilson",
    description: "For students interested in social service and making a positive impact on society.",
  },
  {
    name: "Mathematics Club",
    leader: "Emily Clark",
    faculty: "Prof. Davis",
    description: "A place for math enthusiasts to solve problems and engage in mathematical discussions.",
  },
  {
    name: "Art and Design Club",
    leader: "Sophia Green",
    faculty: "Prof. Lewis",
    description: "For creative minds who are passionate about art and design. Explore new techniques and showcase your work.",
  },
];

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check for token and role in localStorage on component mount
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <Router>
      <nav>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/clubs" className="nav-link">Clubs</Link>
        <Link to="/events" className="nav-link">Events</Link>
        <Link to="/chatbot" className="nav-link">Chatbot</Link>
        {isAuthenticated && userRole === 'admin' && (
          <Link to="/admin" className="nav-link">Admin Dashboard</Link>
        )}
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="nav-link">Log In</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="nav-link logout-btn">Log Out</button>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/clubs" element={<ClubCard clubs={clubs} />} />
        <Route path="/club/:clubName" element={<ClubDetails clubs={clubs} />} />
        <Route path="/join" element={<StudentForm clubs={clubs} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
