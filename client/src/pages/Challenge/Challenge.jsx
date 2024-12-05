import React, { useContext, useEffect, useState } from "react";
import "../Challenge/Challenge.css";
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
  const [challengeStatus, setChallengeStatus] = useState(""); // For storing challenge result
  const [isFinished, setIsFinished] = useState(false); // Track if the user finished the challenge
  const [isBothPlayersConnected, setIsBothPlayersConnected] = useState(false); // Track if both players are connected
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(true); // Disable buttons until both players connect

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
      setIsBothPlayersConnected(true); // Mark that both players are connected
      setIsButtonsDisabled(false); // Enable buttons
    });

    // Listen for when there's no opponent and the user needs to wait
    socket.on("waitingForOpponent", () => {
      setWaitingMessage("Waiting for another player...");
    });

    // Listen for the results of the challenge
    socket.on("user1Wins", () => {
      setChallengeStatus("You win!");
      setModalMessage("You win!"); // Display "You win!" message in the pop-up
      setShowModal(true); // Show pop-up message
    });

    socket.on("user2Wins", () => {
      setChallengeStatus("You lose!");
      setModalMessage("You lose!"); // Display "You lose!" message in the pop-up
      setShowModal(true); // Show pop-up message
    });

    socket.on("user1Loses", () => {
      setChallengeStatus("You lose!");
      setModalMessage("You lose!"); // Display "You lose!" message in the pop-up
      setShowModal(true); // Show pop-up message
    });

    socket.on("user2Loses", () => {
      setChallengeStatus("You win!");
      setModalMessage("You win!"); // Display "You win!" message in the pop-up
      setShowModal(true); // Show pop-up message
    });

    socket.on("draw", () => {
      setChallengeStatus("It's a draw!");
      setModalMessage("It's a draw!"); // Display draw message in the pop-up
      setShowModal(true); // Show pop-up message
    });

    return () => {
      socket.off("startChallenge");
      socket.off("waitingForOpponent");
      socket.off("user1Wins");
      socket.off("user2Wins");
      socket.off("user1Loses");
      socket.off("user2Loses");
      socket.off("draw");
    };
  }, [currentUser?._id, id]);

  const submitAnswer = (selectedKey) => {
    if (!questionsData || questionsData.length === 0) return;

    const currentQuestion = questionsData[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer;
    const isAnswerCorrect = selectedKey === correctAnswer;

    // Emit 'submitAnswer' event with the user's answer and correct answers
    socket.emit("submitAnswer", {
      challengeId: id,
      userId: currentUser?._id,
      answers: [selectedKey], // Store the answers to be checked
      correctAnswers: [correctAnswer], // Pass the correct answer from the question data
    });

    // Set modal message based on correctness
    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect) {
      setModalMessage("Correct answer!");
    } else {
      setModalMessage(
        <>
          <p>Wrong answer.</p>
          <p>Correct answer: {correctAnswer}</p>
          <strong>Explanation:</strong>
          <p>{currentQuestion.explanation}</p>
        </>
      );
    }

    setShowModal(true);
  };

  const handleNextQuestion = () => {
    setShowModal(false);
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // Emit that the user has finished the challenge
      socket.emit("finishChallenge", { challengeId: id, userId: currentUser?._id });
      setIsFinished(true);
      toast.success("Challenge finished!");
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

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error loading challenge data</div>;
  }

  if (!questionsData || questionsData.length === 0) {
    return <div>No questions available</div>;
  }

  const currentQuestion = questionsData[currentQuestionIndex];
  const options = currentQuestion?.options || {};
  const optionsArray = Object.entries(options);

  return (
    <div className="challenge-container">
      <div className="challenge">
        {waitingMessage && <p>{waitingMessage}</p>} {/* Display waiting message */}
        {challengeStatus && <p>{challengeStatus}</p>} {/* Display challenge result */}
        <div className="challenge-question">
          <p>{currentQuestion?.questionText || "Question not available"}</p>
        </div>
        <div className="challenge-options">
          {optionsArray.length > 0 ? (
            optionsArray.map(([key, value], index) => (
              <button
                key={index}
                onClick={() => submitAnswer(key)}
                disabled={isButtonsDisabled} // Disable buttons before both players connect
              >
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
            disabled={currentQuestionIndex === 0 || isButtonsDisabled} // Disable navigation buttons before both players connect
          >
            Previous
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={isButtonsDisabled} // Disable navigation buttons before both players connect
          >
            {currentQuestionIndex < questionsData.length - 1 ? "Next" : "Finish"}
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
