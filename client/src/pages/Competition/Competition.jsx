import React, { useState } from "react";
import "./Competition.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import ResponsiveNav from "../../components/Sidebar/ResponsiveNav";
import { ToastContainer, toast } from "react-toastify";

const Competition = () => {
  const [quizLink, setQuizLink] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    "General Knowledge",
    "Science",
    "Math",
    "History",
    "Technology",
  ];

  const generateLink = () => {
    console.log(selectedCategory);
    if (selectedCategory !== "") {
      const randomId = Math.random().toString(36).substring(2, 8);
      setQuizLink(`https://quizapp.com/competition/${randomId}`);
    } else {
      toast.error("Izaberite kategoriju.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="competition">
      <div className="sidebar-div">
        <Sidebar />
      </div>
      <div className="responsive-nav-div">
        <ResponsiveNav />
      </div>
      <div className="competition-container">
        <div className="competition-content">
          <h1>Takmičenja</h1>
          <p>Izazovite prijatelja i proverite znanje!</p>

          <div className="competition-actions">
            <div className="category-select">
              <label htmlFor="categories">Izaberite kategoriju:</label>
              <select
                id="categories"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">-- Izaberite --</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <button className="generate-link-button" onClick={generateLink}>
              Generišite Link
            </button>
          </div>

          {quizLink && (
            <div className="quiz-link-container">
              <p>
                Podelite ovaj link sa prijateljima:
                <a href={quizLink} target="_blank" rel="noopener noreferrer">
                  {quizLink}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Competition;
