import "./Leaderboard.css";
import profilePicture from "../../assets/profile.png";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const LeaderboardPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryFn: async () =>
      await axios
        .get('http://localhost:8080/api/user/getUsers')
        .then((res) => res.data),
    queryKey: ["users"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading leaderboard data.</div>;
  }

  const sortedUsers = [...data].sort((a, b) => b.points - a.points);

  const topThreeUsers = sortedUsers.slice(0, 3);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-container2">
        <div className="first-three">
          {topThreeUsers.map((user, index) => (
            <div
              key={user._id}
              className={
                index === 0
                  ? "gold"
                  : index === 1
                  ? "silver"
                  : "bronze"
              }
            >
              <h1>{user.firstName} {user.lastName}</h1>
              <img
                className="profile-picture"
                src={profilePicture}
                alt="profile"
              />
            </div>
          ))}
        </div>

        <div className="sections">
          <h1>Rank</h1>
          <h1>Ime</h1>
          <h1>Poeni</h1>
        </div>

        {sortedUsers.map((user, index) => (
          <div className="student" key={user._id}>
            <h3>{index + 1}</h3>
            <h3>{user.firstName} {user.lastName}</h3>
            <h3>{user.completedCourses}</h3>
            <h3>{user.points}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;