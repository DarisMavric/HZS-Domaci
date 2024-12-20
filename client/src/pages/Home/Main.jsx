import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "../Home/Home.css";

const Main = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const { currentUser } = useContext(AuthContext);

  const itemsPerPage = 2;

  const zanimanja = ["programiranje", "matematika", "istorija"];

  useEffect(() => {
    const fetchNews = async () => {
      const url = "https://tech-news3.p.rapidapi.com/venturebeat";
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "3b4527075cmsh79523ddacf39cecp16c169jsn87d2fcb4ebd0",
          "x-rapidapi-host": "tech-news3.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNews();
  }, []);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryFn: async () =>
      await axios
        .get("http://localhost:8080/api/quiz/getQuizzes")
        .then((res) => {
          return res.data;
        }),
    queryKey: ["quizzes"],
  });

  if (isLoading) {
    return <div>Loading quizzes...</div>;
  }

  const preporuceniKvizovi = [
    {
      name: "JavaScript kviz",
      points: "100",
      category: "programiranje",
      difficulty: "srednje",
    },
    {
      name: "Prvi sv. rat",
      points: "50",
      category: "istorija",
      difficulty: "lako",
    },
    {
      name: "React kviz",
      points: "150",
      category: "programiranje",
      difficulty: "teško",
    },
    {
      name: "Algebra osnove",
      points: "80",
      category: "matematika",
      difficulty: "lako",
    },
    {
      name: "CSS dizajn",
      points: "120",
      category: "programiranje",
      difficulty: "srednje",
    },
  ];

  const filteredQuizzes = preporuceniKvizovi.filter((kviz) =>
    zanimanja.includes(kviz.category)
  );

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuizzes = filteredQuizzes.slice(startIndex, endIndex);

  const handleNext = () => {
    if (endIndex < filteredQuizzes.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="main">
      <h1 className="main-h1">Kvizovi</h1>

      <div className="preporuceni-div">
        <h2 className="preporuceni">Preporučeni</h2>

        <div className="preporuceni-kvizovi">
          {data
            ?.filter((kviz) => currentUser?.interests.includes(kviz.category))
            .map((kviz, index) => (
              <div className="quizq" key={index}>
                <div className="up-quiz">
                  <div className="quiz-photo"></div>
                  <p className="quiz-name">{kviz.name}</p>
                </div>
                <div className="down-quiz">
                  <p className="category-p">
                    Kategorija: <span>{kviz.category}</span>
                  </p>
                  <p className="points-p">
                    Poeni: <span>{"" + kviz.points}</span>
                  </p>
                  <p className="difficulty-p">
                    Težina: <span>{kviz.difficulty}</span>
                  </p>
                  <div className="button-div">
                    <Link className="pokreni-button" to={"/quiz/" + kviz._id}>
                      Pokreni
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="pagination-buttons">
          <button onClick={handlePrev} disabled={currentPage === 0}>
            Prethodni
          </button>
          <button
            onClick={handleNext}
            disabled={endIndex >= filteredQuizzes.length}
          >
            Sledeći
          </button>
        </div>
      </div>

      <div className="all-quizes">
        <h2 className="preporuceni">Svi</h2>
        <div className="svi-kvizovi">
          {data?.map((kviz, index) => (
            <div className="quizq" key={index}>
              <div className="up-quiz">
                <div className="quiz-photo"></div>
                <p className="quiz-name">{kviz.title}</p>
              </div>
              <div className="down-quiz">
                <p className="category-p">
                  Kategorija: <span>{kviz.category}</span>
                </p>
                <p className="points-p">
                  Poeni: <span>{kviz.points}</span>
                </p>
                <p className="difficulty-p">
                  Težina: <span>{kviz.difficulty}</span>
                </p>
                <div className="button-div">
                  <Link className="pokreni-button" to={"/quiz/" + kviz._id}>
                    Pokreni
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
