import React from "react";
import "./RegisterLogin.css";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .required("obavezno polje")
        .email("e-mail nije validan"),
      password: Yup.string()
        .required("obavezno polje")
        .min(6, "minimalna duzina je 6 karaktera")
        .max(20, "maksimalna duzina je 20 karaktera"),
    }),

    onSubmit: (values) => {
      console.log("Podaci za login:", values);
      navigate("/");
    },
  });

  return (
    <div className="register-login-div">
      <h1 className="register-login-h1">Prijavi se</h1>

      <form onSubmit={formik.handleSubmit} className="register-form">
        <div className="sve">
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

        <p className="yar" onClick={() => navigate("/register")}>
          Nemas kreiran nalog?
        </p>

        <button type="submit" className="submit-button">
          Prijavi se
        </button>
      </form>
    </div>
  );
};

export default Register;
