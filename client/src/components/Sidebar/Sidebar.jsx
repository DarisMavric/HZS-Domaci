import React from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="top">
        <div className="pfp"></div>
        <p
          className="username"
          onClick={() => {
            navigate("/profile");
          }}
        >
          username_1
        </p>
      </div>

      <div className="middle">
        <ul>
          <li onClick={() => navigate("/")}>Kvizovi</li>
          <li onClick={() => navigate("/friends")}>Prijatelji</li>
          <li className="o3">Takmicenja</li>
        </ul>
      </div>

      <div className="bottom"></div>
    </div>
  );
};

export default Sidebar;
