import React, { useEffect } from "react";
import "../Quiz/Quiz.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Quiz = () => {
  useEffect(() => {
    toast.info(
      "France, known for its rich history and culture, has Paris as its capital city. Paris is often called the 'City of Light' and is famous for landmarks like the Eiffel Tower and the Louvre Museum.",
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        style: { width: "400px" },
        closeOnClick: true,
        pauseOnHover: true,
      }
    );
  }, []);
  const questions = {
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "Madrid", "London"],
    answer: "Paris",
  };

  return (
    <div className="quiz-container">
      <div className="quiz">
        <div className="quiz-question">
          {" "}
          <p>{questions.question}</p>
        </div>
        <div className="quiz-options">
          {questions.options.map((option, index) => (
            <button key={index}>{option}</button>
          ))}
        </div>
        <button>Try Again</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Quiz;
