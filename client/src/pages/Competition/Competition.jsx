import React, { useContext, useState } from "react";
import "./Competition.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import ResponsiveNav from "../../components/Sidebar/ResponsiveNav";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Competition = () => {
  const [quizLink, setQuizLink] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const categories = [
    "istorija",
    "programiranje",
    "Math",
    "History",
    "Technology",
  ];

  const generateLink = async () => {
    if (selectedCategory !== "") {
      console.log(currentUser?._id)
      try {
        const response = await axios.post('http://localhost:8080/api/challenge/createChallenge',{
          challengerId: currentUser?._id,
          category: selectedCategory
        }).then(res => {return res.data});
  
        // Access the _id directly from response.data
        const id = response.challengeId
  
        if (id) {
          setQuizLink(`http://localhost:3000/challenge/${id}`);
        }
      } catch (error) {
        console.error('Error creating challenge:', error);
        toast.error('There was an error creating the challenge.', {
          position: "top-center",
          autoClose: 3000,
        });
      }
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
