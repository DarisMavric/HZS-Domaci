import React, { useContext, useEffect, useState } from "react";
import "../Challenge/Challenge.css";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

const Challenge = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState("");
  const [challengeStatus, setChallengeStatus] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [isBothPlayersConnected, setIsBothPlayersConnected] = useState(false);
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(true);

  const {
    data: questionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["challenge", id],
    queryFn: async () =>
      axios
        .get(`http://localhost:8080/api/challenge/getChallenge/${id}`)
        .then((res) => res.data),
  });

  useEffect(() => {
    toast.info("Welcome to the challenge!", { position: "top-center" });

    socket.emit("joinChallenge", { userId: currentUser?._id, challengeId: id });

    socket.on("startChallenge", () => {
      setWaitingMessage("");
      toast.success("Both players connected, challenge starting!");
      setIsBothPlayersConnected(true);
      setIsButtonsDisabled(false);
    });

    socket.on("waitingForOpponent", () => {
      setWaitingMessage("Waiting for another player...");
    });

    // Kada jedan korisnik završi izazov, obavesti oba korisnika
    socket.on("challengeFinished", (winnerId) => {
      if (currentUser?._id === winnerId) {
        toast.success("You won the challenge! 🎉", { position: "top-center" });
        setChallengeStatus("You win!");
      } else {
        toast.error("You lost the challenge! 😞", { position: "top-center" });
        setChallengeStatus("You lose!");
      }
      setModalMessage(challengeStatus);
      setShowModal(true);
      setIsButtonsDisabled(true); // Onemogući dugmadi
    });

    socket.on("user1Wins", () => {
      setChallengeStatus("You win!");
      toast.success("You won the challenge! 🎉", { position: "top-center" });
      setShowModal(true);
    });

    socket.on("user2Wins", () => {
      setChallengeStatus("You lose!");
      toast.error("You lost the challenge! 😞", { position: "top-center" });
      setShowModal(true);
    });

    socket.on("user1Loses", () => {
      setChallengeStatus("You lose!");
      toast.error("You lost the challenge! 😞", { position: "top-center" });
      setShowModal(true);
    });

    socket.on("user2Loses", () => {
      setChallengeStatus("You win!");
      toast.success("You won the challenge! 🎉", { position: "top-center" });
      setShowModal(true);
    });

    socket.on("draw", () => {
      setChallengeStatus("It's a draw!");
      toast.info("The challenge ended in a draw!", { position: "top-center" });
      setShowModal(true);
    });

    return () => {
      socket.off("startChallenge");
      socket.off("waitingForOpponent");
      socket.off("challengeFinished");
      socket.off("user1Wins");
      socket.off("user2Wins");
      socket.off("user1Loses");
      socket.off("user2Loses");
      socket.off("draw");
    };
  }, [currentUser?._id, id, challengeStatus]);

  const submitAnswer = (selectedKey) => {
    if (!questionsData || questionsData.length === 0 || isFinished) return;

    const currentQuestion = questionsData[currentQuestionIndex];
    const isAnswerCorrect = selectedKey === currentQuestion.correctAnswer;

    socket.emit("submitAnswer", {
      challengeId: id,
      userId: currentUser?._id,
      answers: [selectedKey],
    });

    setIsCorrect(isAnswerCorrect);
    setModalMessage(
      isAnswerCorrect
        ? "Correct answer!"
        : `Wrong answer. Correct answer: ${currentQuestion.correctAnswer}`
    );
    setShowModal(true);
  };

  const handleNextQuestion = () => {
    setShowModal(false);
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Emitovanje završetka izazova
      socket.emit("finishChallenge", {
        challengeId: id,
        userId: currentUser?._id,
      });
      setIsFinished(true);
      toast.success("Challenge finished! 🎉", { position: "top-center" });
    }
  };

  const handleRetry = () => setShowModal(false);

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading challenge data</div>;
  if (!questionsData || questionsData.length === 0)
    return <div>No questions available</div>;

  const currentQuestion = questionsData[currentQuestionIndex];
  const optionsArray = Object.entries(currentQuestion?.options || {});

  return (
    <div className="challenge-container">
      <div className="challenge">
        {waitingMessage && <p>{waitingMessage}</p>}
        {challengeStatus && <p>{challengeStatus}</p>}
        <div className="challenge-question">
          <p>{currentQuestion?.questionText || "Question not available"}</p>
        </div>
        <div className="challenge-options">
          {optionsArray.map(([key, value], index) => (
            <button
              key={index}
              onClick={() => submitAnswer(key)}
              disabled={isButtonsDisabled}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="challenge-navigation">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || isButtonsDisabled}
          >
            Previous
          </button>
          <button onClick={handleNextQuestion} disabled={isButtonsDisabled}>
            {currentQuestionIndex < questionsData.length - 1
              ? "Next"
              : "Finish"}
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
