import React from "react";
import "./Sidebar.css";
import { MdFace } from "react-icons/md";
import { MdOutlineQuiz } from "react-icons/md";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { FaMedal } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa";

const ResponsiveNav = () => {
  return (
    <div className="responsive-nav">
      <ul>
        <li>
          <MdFace />
        </li>
        <li>
          <MdOutlineQuiz />
        </li>
        <li>
          <LiaUserFriendsSolid />
        </li>
        <li>
          <FaMedal />
        </li>
        <li className="news-li">
          <FaRegNewspaper />
        </li>
      </ul>
    </div>
  );
};

export default ResponsiveNav;
