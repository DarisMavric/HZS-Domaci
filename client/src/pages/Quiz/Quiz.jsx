import React, { useContext, useEffect, useState } from "react";
import "./Quiz.css";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";

const Quiz = () => {
  const { quizId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    data: questionsData,
    isLoading,
    error,
  } = useQuery({
    queryFn: async () =>
      await axios
        .get(`http://localhost:8080/api/quiz/getQuizQuestions/${quizId}`)
        .then((res) => res.data),
    queryKey: ["quizQuestions", quizId],
  });

  useEffect(() => {
    toast.info("Welcome to the quiz!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  }, []);

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error loading quiz data</div>;
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
          <p>
            <p>Correct asnwer : {currentQuestion.correctAnswer}</p>
            <strong>Objasnjenje:</strong>
            <p>{currentQuestion.explanation}</p>
          </p>
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
          "http://localhost:8080/api/quiz/quizReward",
          {
            userId: currentUser?._id,
            quizId: currentQuestion?.quizId,
          }
        );
        if (response.data) {
          console.log("Points updated successfully!");
          navigate("/");
        } else {
          console.error("Failed to update points");
        }
      } catch (error) {
        console.error("Error completing the quiz:", error);
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
    <div className="quiz-container">
      <div className="quiz">
        <div className="quiz-question">
          <p>{currentQuestion?.questionText || "Question not available"}</p>
        </div>
        <div className="quiz-options">
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
        {/* <div className="quiz-navigation">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
          </button>
        </div> */}
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

export default Quiz;
