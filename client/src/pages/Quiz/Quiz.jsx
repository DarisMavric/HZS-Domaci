import React, { useContext, useEffect, useState } from "react";
import "../Quiz/Quiz.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Quiz = () => {
  const { quizId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const {currentUser} = useContext(AuthContext);

  const navigate = useNavigate();

  const { data: questionsData, isLoading, error } = useQuery({
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

  const optionsArray = Object.entries(options); // Convert options object to an array of [key, value] pairs

  const handleOptionClick = (selectedKey) => {
    const selectedOption = options[selectedKey]; // Get the value of the selected option based on key
    if (selectedKey === currentQuestion.correctAnswer) {
      toast.success(`${currentQuestion.explanation}`, {
        position: "top-center",
        autoClose: 5000,
      });
    } else {
      toast.error("Wrong answer. Try again!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleNextQuestion = async () => {
    try {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        toast.success("You have completed the quiz!", { position: "top-center" });
        const response = await axios.post(
          'http://localhost:8080/api/quiz/quizReward',
          { userId: currentUser?._id, quizId: currentQuestion?.quizId }
        );
  
        if (response.data) {
          console.log('Points updated successfully!');
          toast.success('Your points have been updated!', { position: "top-center" });
          navigate('/');
        } else {
          console.error('Failed to update points');
          toast.error('Failed to update points', { position: "top-center" });
        }
      }
    } catch (error) {
      console.error('Error while handling next question:', error);
      toast.error('An error occurred while completing the quiz. Please try again later.', {
        position: "top-center",
      });
    }
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
        <div className="quiz-navigation">
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
      <ToastContainer />
    </div>
  );
};

export default Quiz;