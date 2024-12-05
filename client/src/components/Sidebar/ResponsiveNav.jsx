import React from "react";
import "./Sidebar.css";
import { MdFace } from "react-icons/md";
import { MdOutlineQuiz } from "react-icons/md";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { FaMedal } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ResponsiveNav = () => {
  const navigate = useNavigate();

  return (
    <div className="responsive-nav">
      <ul>
        <li onClick={() => navigate("/profile")}>
          <MdFace />
        </li>
        <li onClick={() => navigate("/")}>
          <MdOutlineQuiz />
        </li>
        <li onClick={() => navigate("/friends")}>
          <LiaUserFriendsSolid />
        </li>
        <li onClick={() => navigate("/")}>
          <FaMedal />
        </li>
        <li className="news-li" onClick={() => navigate("/news")}>
          <FaRegNewspaper />
        </li>
      </ul>
    </div>
  );
};

export default ResponsiveNav;
