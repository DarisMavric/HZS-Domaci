import React, { useState } from "react";
import "./Profile.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import ResponsiveNav from "../../components/Sidebar/ResponsiveNav";
import { FaPen } from "react-icons/fa6";
import { useFormik } from "formik";
import * as Yup from "yup";

const Profile = () => {
  const [editStates, setEditStates] = useState({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
  });

  const interesovanja = [
    "programiranje",
    "istorija",
    "geografija",
    "fizika",
    "matematika",
    "biologija",
  ];

  const toggleEdit = (field) => {
    setEditStates((prevStates) => ({
      ...prevStates,
      [field]: !prevStates[field],
    }));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "Postojece Ime",
      lastName: "Postojece Prezime",
      username: "Postojeci username",
      email: "Postojeci E-mail",
      password: "Postojeca sifra",
      interests: [],
    },

    validationSchema: Yup.object({
      firstName: Yup.string().required("Obavezno polje"),
      lastName: Yup.string().required("Obavezno polje"),
      username: Yup.string()
        .required("Obavezno polje")
        .min(6, "Minimalna dužina je 6 karaktera")
        .max(20, "Maksimalna dužina je 20 karaktera")
        .lowercase("Korisničko ime ne sme da ima velika slova"),
      email: Yup.string()
        .required("Obavezno polje")
        .email("E-mail nije validan"),
      password: Yup.string()
        .required("Obavezno polje")
        .min(6, "Minimalna dužina je 6 karaktera")
        .max(20, "Maksimalna dužina je 20 karaktera"),
      interests: Yup.array().min(
        1,
        "Morate odabrati najmanje jedno interesovanje"
      ),
    }),

    onSubmit: async (values) => {
      console.log("Ažurirani podaci:", values);
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
    <div className="profile">
      <div className="sidebar-div">
        <Sidebar />
      </div>

      <div className="responsive-nav-div">
        <ResponsiveNav />
      </div>

      <form onSubmit={formik.handleSubmit} className="profile-container">
        <div className="pfp-profile"></div>

        <div className="ime-div-profile">
          <input
            type="text"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!editStates.firstName}
          />
          <button
            type="button"
            className="ime-button"
            onClick={() => toggleEdit("firstName")}
          >
            <FaPen />
          </button>
          {formik.errors.firstName && formik.touched.firstName && (
            <p className="error">{formik.errors.firstName}</p>
          )}
        </div>

        <div className="prezime-div-profile">
          <input
            type="text"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!editStates.lastName}
          />
          <button
            type="button"
            className="prezime-button"
            onClick={() => toggleEdit("lastName")}
          >
            <FaPen />
          </button>
          {formik.errors.lastName && formik.touched.lastName && (
            <p className="error">{formik.errors.lastName}</p>
          )}
        </div>

        <div className="korisnicko-ime-div-profile">
          <input
            type="text"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!editStates.username}
          />

          {formik.errors.username && formik.touched.username && (
            <p className="error">{formik.errors.username}</p>
          )}
        </div>

        <div className="email-div-profile">
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!editStates.email}
          />
          <button
            type="button"
            className="email-button"
            onClick={() => toggleEdit("email")}
          >
            <FaPen />
          </button>
          {formik.errors.email && formik.touched.email && (
            <p className="error">{formik.errors.email}</p>
          )}
        </div>

        <div className="password-div-profile">
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!editStates.password}
          />
          <button
            type="button"
            className="password-button"
            onClick={() => toggleEdit("password")}
          >
            <FaPen />
          </button>
          {formik.errors.password && formik.touched.password && (
            <p className="error">{formik.errors.password}</p>
          )}
        </div>

        <div className="interests-div-profile">
          <h2 className="interests-label-profile">Interesovanja:</h2>

          <div className="all-interests-profile">
            <div className="first-3-interests-profile">
              {interesovanja.slice(0, 3).map((interesovanje) => (
                <div
                  className="single-interest-profile"
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
                  className="single-interest-profile"
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

        <button type="submit" className="sacuvaj-button">
          Sačuvaj
        </button>
      </form>
    </div>
  );
};

export default Profile;
