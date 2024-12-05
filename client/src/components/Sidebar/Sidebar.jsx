import React, { useContext } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();

  const {currentUser} = useContext(AuthContext);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", currentUser?._id],
    queryFn: async () =>
      axios
        .post(`http://localhost:8080/api/user/getUser`, {
          id: currentUser?._id
        })
        .then((res) => res.data),
  });

  if(isLoading){
    <div>Loading</div>
  }

  console.log(data);

  return (
    <div className="sidebar">
      <div className="top">
        <div className="pfp"></div>
        <p className="username">{data?.username}</p>
        <p className="points">{data?.points} Poena</p>
      </div>

      <div className="middle">
        <ul>
          <li>Kvizovi</li>
          <li
            onClick={() => {
              navigate("/friends");
            }}
          >
            Prijatelji
          </li>
          <li className="o3"
          onClick={() => {
              navigate("/competition");
            }}>Takmicenja</li>
          <li className="o3"
          onClick={() => {
              navigate("/leaderboard");
            }}>Rang Lista</li>
        </ul>
      </div>

      <div className="bottom"></div>
    </div>
  );
};

export default Sidebar;
