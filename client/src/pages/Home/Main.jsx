import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Main = () => {
  const cardObject = [
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
  ];

  return (
    <div className="main">
      <h1 className="main-h1">Kvizovi</h1>
      <div className="preporuceni-div">
        <h2 className="preporuceni">Preporučeni</h2>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={10}
          slidesPerView={2}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
          className="preporuceni-quiz"
        >
          {cardObject.map((kviz, index) => (
            <SwiperSlide key={index} className="kviz">
              <div className="quiz">
                <div className="up-quiz">
                  <div className="quiz-photo"></div>
                  <p className="quiz-name">{kviz.name}</p>
                </div>
                <div className="down-quiz">
                  <p className="category-p">
                    Kategorija:{" "}
                    <span className="quiz-span">{kviz.category}</span>
                  </p>
                  <p className="points-quiz">
                    Poeni: <span className="quiz-span">{kviz.points}</span>
                  </p>
                  <p className="category-p">
                    Težina: <span className="quiz-span">{kviz.difficulty}</span>
                  </p>
                  <button className="pokreni-button">Pokreni</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Main;
