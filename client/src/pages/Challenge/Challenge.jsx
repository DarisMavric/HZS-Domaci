import React, { useContext, useEffect, useState } from "react";
import "../Challenge/Challenge.css"
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";
import io from "socket.io-client"; // Import socket.io-client

const socket = io("http://localhost:8080"); // Connect to the server

const Challenge = () => {
  const { id } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState(""); // For waiting message

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    data: questionsData,
    isLoading,
    error,
  } = useQuery({
    queryFn: async () =>
      await axios
        .get(`http://localhost:8080/api/challenge/getChallenge/${id}`)
        .then((res) => res.data),
    queryKey: ["challenge", id],
  });

  useEffect(() => {
    toast.info("Welcome to the challenge!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });

    // Emit join event to start waiting for the other player
    socket.emit("joinChallenge", { userId: currentUser?._id, challengeId: id });

    // Listen for when both players are connected and the challenge can start
    socket.on("startChallenge", () => {
      setWaitingMessage(""); // Clear waiting message
      toast.success("Both players are connected, challenge starting!", {
        position: "top-center",
        autoClose: 5000,
      });
    });

    // Listen for when there's no opponent and the user needs to wait
    socket.on("waitingForOpponent", () => {
      setWaitingMessage("Waiting for another player...");
    });

    return () => {
      socket.off("startChallenge");
      socket.off("waitingForOpponent");
    };
  }, [currentUser?._id, id]);

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error loading challenge data</div>;
  }

  if (!questionsData || questionsData.length === 0) {
    return <div>No questions available</div>;
  }

  const questions = questionsData;
  const currentQuestion = questions[currentQuestionIndex];
  const options = currentQuestion?.options || {};
  const optionsArray = Object.entries(options);

  const handleOptionClick = (selectedKey) => {
    const isAnswerCorrect = selectedKey === currentQuestion.correctAnswer;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setModalMessage("Correct answer!");
    } else {
      setModalMessage(
        <>
          <p>Wrong answer.</p>
          <p>Correct answer: {currentQuestion.correctAnswer}</p>
          <strong>Explanation:</strong>
          <p>{currentQuestion.explanation}</p>
        </>
      );
    }

    setShowModal(true);
  };

  const handleNextQuestion = async () => {
    setShowModal(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/challenge/challengeReward",
          {
            userId: currentUser?._id,
            challengeId: currentQuestion?.challengeId,
          }
        );
        if (response.data) {
          console.log("Points updated successfully!");
          navigate("/");
        } else {
          console.error("Failed to update points");
        }
      } catch (error) {
        console.error("Error completing the challenge:", error);
      }
    }
  };

  const handleRetry = () => {
    setShowModal(false);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="challenge-container">
      <div className="challenge">
        {waitingMessage && <p>{waitingMessage}</p>} {/* Display waiting message */}
        <div className="challenge-question">
          <p>{currentQuestion?.questionText || "Question not available"}</p>
        </div>
        <div className="challenge-options">
          {optionsArray.length > 0 ? (
            optionsArray.map(([key, value], index) => (
              <button key={index} onClick={() => handleOptionClick(key)}>
                {value}
              </button>
            ))
          ) : (
            <p>No options available</p>
          )}
        </div>
        <div className="challenge-navigation">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
            {isCorrect ? (
              <button onClick={handleNextQuestion}>Next</button>
            ) : (
              <button onClick={handleRetry}>Try Again</button>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Challenge;