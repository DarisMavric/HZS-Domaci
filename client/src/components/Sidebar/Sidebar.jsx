import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <div className="pfp"></div>
        <p className="username">username_1</p>
      </div>

      <div className="middle">
        <ul>
          <li>Opcija 1</li>
          <li>Opcija 2</li>
          <li className="o3">Opcija 3</li>
        </ul>
      </div>

      <div className="bottom"></div>
    </div>
  );
};

export default Sidebar;
