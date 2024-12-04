import React from "react";
import "./Home.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Main from "./Main";
import News from "./News";
import ResponsiveNav from "../../components/Sidebar/ResponsiveNav";

const Home = () => {
  return (
    <div className="home">
      <div className="sidebar-div">
        <Sidebar />
      </div>

      <div className="responsive-nav-div">
        <ResponsiveNav />
      </div>

      <div className="main-div">
        <Main />
      </div>

      <div className="news-div">
        <News />
      </div>
    </div>
  );
};

export default Home;
