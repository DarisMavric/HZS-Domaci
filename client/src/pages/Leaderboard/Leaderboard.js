import "./Leaderboard.css";
import profilePicture from "../../assets/profile.png";

const LeaderboardPage = () => {
  return (
    <div className="leaderboard-container">
      <div className="leaderboard-container2">
        <div className="first-three">
          <div className="silver">
            <h1>Emin Redzovic</h1>
            <img
              className="profile-picture"
              src={profilePicture}
              alt="profilna slika"
            />
          </div>
          <div className="gold">
            <h1>Daris Mavric</h1>
            <img
              className="profile-picture"
              src={profilePicture}
              alt="profilna slika"
            />
          </div>
          <div className="bronze">
            <h1>Danilo Petrovic</h1>
            <img
              className="profile-picture"
              src={profilePicture}
              alt="profilna slika"
            />
          </div>
        </div>

        <div className="sections">
          <h1>Rank</h1>
          <h1>Ime</h1>
          <h1>Zavrseni Kursevi</h1>
          <h1>Poeni</h1>
        </div>
        <div className="student">
          <h3>1</h3>
          <h3>Daris Mavric</h3>
          <h3>20</h3>
          <h3>1208</h3>
        </div>
        <div className="student">
          <h3>2</h3>
          <h3>Emin Redzovic</h3>
          <h3>18</h3>
          <h3>1000</h3>
        </div>
        <div className="student">
          <h3>3</h3>
          <h3>Danilo Petrovic</h3>
          <h3>10</h3>
          <h3>650</h3>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
