import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to the Club Management System</h1>
      <p>Explore our clubs and join the ones that interest you!</p>
      <Link to="/clubs" className="nav-link">
        <button className="view-details-btn">View Clubs</button>
      </Link>
    </div>
  );
};

export default HomePage;
