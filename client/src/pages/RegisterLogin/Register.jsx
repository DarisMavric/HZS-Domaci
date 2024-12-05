import React, { useContext, useEffect, useState } from "react";
import "./RegisterLogin.css";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { AuthContext } from "../../context/AuthContext.js";

const Register = () => {
  const navigate = useNavigate();

  const [err, setErr] = useState("");

  const { currentUser } = useContext(AuthContext);

  const { register } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    } else {
      navigate("/register");
    }
  }, []);

  const interesovanja = [
    "programiranje",
    "istorija",
    "geografija",
    "fizika",
    "matematika",
    "biologija",
  ];

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      interests: [],
    },

    validationSchema: Yup.object({
      firstName: Yup.string().required("obavezno polje"),
      lastName: Yup.string().required("obavezno polje"),
      username: Yup.string()
        .required("obavezno polje")
        .min(6, "minimalna duzina je 6 karaktera")
        .max(20, "maksimalna duzina je 20 karaktera")
        .lowercase("korisnicko ime ne sme da ima velika slova"),
      email: Yup.string()
        .required("obavezno polje")
        .email("e-mail nije validan"),
      password: Yup.string()
        .required("obavezno polje")
        .min(6, "minimalna duzina je 6 karaktera")
        .max(20, "maksimalna duzina je 20 karaktera"),
      interests: Yup.array().min(1, "morate imati minimum jedno interesovanje"),
    }),

    onSubmit: async (values) => {
      try {
        console.log(values);
        await register(values);
        navigate("/");
      } catch (err) {
        setErr(err.response.data);
      }
    },
  });

  const handleInterestClick = (interest) => {
    const currentInterests = formik.values.interests;
    if (currentInterests.includes(interest)) {
      formik.setFieldValue(
        "interests",
        currentInterests.filter((item) => item !== interest)
      );
    } else {
      formik.setFieldValue("interests", [...currentInterests, interest]);
    }
  };

  return (
    <div className="register-login-div">
      <h1 className="register-login-h1">Registracija</h1>

      <form onSubmit={formik.handleSubmit} className="register-form">
        <div className="sve">
          <div className="name-div">
            <input
              className="name-input"
              name="firstName"
              value={formik.values.firstName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Ime..."
            />
            {formik.errors.firstName && formik.touched.firstName ? (
              <p className="error">{formik.errors.firstName}</p>
            ) : null}
          </div>

          <div className="lastName-div">
            <input
              className="lastName-input"
              name="lastName"
              value={formik.values.lastName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Prezime..."
            />
            {formik.errors.lastName && formik.touched.lastName ? (
              <p className="error">{formik.errors.lastName}</p>
            ) : null}
          </div>

          <div className="username-div">
            <input
              className="username-input"
              name="username"
              value={formik.values.username}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Korisnicko ime..."
            />
            {formik.errors.username && formik.touched.username ? (
              <p className="error">{formik.errors.username}</p>
            ) : null}
          </div>

          <div className="email-div">
            <input
              className="email-input"
              name="email"
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="e-mail..."
            />
            {formik.errors.email && formik.touched.email ? (
              <p className="error">{formik.errors.email}</p>
            ) : null}
          </div>

          <div className="password-div">
            <input
              className="password-input"
              name="password"
              type="password"
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Sifra..."
            />
            {formik.errors.password && formik.touched.password ? (
              <p className="error">{formik.errors.password}</p>
            ) : null}
          </div>
        </div>

        <div className="interests-div">
          <h2 className="interests-label">Interesovanja:</h2>

          <div className="all-interests">
            <div className="first-3-interests">
              {interesovanja.slice(0, 3).map((interesovanje) => (
                <div
                  className="single-interest"
                  key={interesovanje}
                  onClick={() => handleInterestClick(interesovanje)}
                >
                  <button
                    type="button"
                    className={
                      formik.values.interests.includes(interesovanje)
                        ? "selected"
                        : ""
                    }
                  >
                    {interesovanje}
                  </button>
                </div>
              ))}
            </div>

            <div className="last-3-interests">
              {interesovanja.slice(3).map((interesovanje) => (
                <div
                  className="single-interest"
                  key={interesovanje}
                  onClick={() => handleInterestClick(interesovanje)}
                >
                  <button
                    type="button"
                    className={
                      formik.values.interests.includes(interesovanje)
                        ? "selected"
                        : ""
                    }
                  >
                    {interesovanje}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="yar" onClick={() => navigate("/login")}>
          Vec imas kreiran nalog?
        </p>

        <button type="submit" className="submit-button">
          Registruj se
        </button>
      </form>
    </div>
  );
};

export default Register;
