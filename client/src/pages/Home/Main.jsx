import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

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
    return (
      <div className="loading-div">
        <p>Loading quizzes...</p>
      </div>
    );
  }

  const preporuceniKvizovi = data?.filter((kviz) =>
    currentUser?.interests.includes(kviz.category)
  );

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

  console.log(currentUser?.interests);

  return (
    <div className="main">
      <h1 className="main-h1">Kvizovi</h1>

      <div className="preporuceni-div">
        <h2 className="preporuceni">Preporučeni</h2>

        <div className="preporuceni-kvizovi">
          {data
            ?.filter((kviz) => currentUser?.interests.includes(kviz.category))
            .map((kviz, index) => (
              <div className="quiz-card" key={index}>
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
                  <button className="pokreni-button">Pokreni</button>
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
            <div className="quiz-card" key={index}>
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
                <button className="pokreni-button">Pokreni</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
