import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router";

const Sidebar = ({ currentSidebar, setSidebar }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  let handlesidebarclick = (tabname) => {
    setSidebar(tabname);
  };

  return (
    <div
      className={`d-flex flex-column flex-shrink-0 text-bg-light sidebar`}
      style={{ width: "250px" }}
    >
      <Link
        to="/"
        className={`d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none`}
      >
        <svg className="bi pe-none me-2" width="40" height="32">
          <use xlinkHref="#bootstrap"></use>
        </svg>
        <span className="fs-4 text-black">Functionalities</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li
          className="nav-item"
          onClick={() => {
            handlesidebarclick("Home");
          }}
        >
          <Link
            to="/"
            className={`nav-link text-black fs-6 ${
              currentSidebar === "Home" && "active"
            }`}
            aria-current="page"
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="*"></use>
            </svg>
            Home
          </Link>
        </li>
        <li
          onClick={() => {
            handlesidebarclick("Topic Learning");
          }}
        >
          <Link
            to="/topic-learning"
            className={`nav-link text-black fs-6 ${
              currentSidebar === "Topic Learning" && "active"
            }`}
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#speedometer2"></use>
            </svg>
            Topic Learning
          </Link>
        </li>
        <li
          onClick={() => {
            handlesidebarclick("Generate MCQs");
          }}
        >
          <Link
            to="/generate-mcqs"
            className={`nav-link text-black fs-6 ${
              currentSidebar === "Generate MCQs" && "active"
            }`}
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#table"></use>
            </svg>
            Generate MCQs
          </Link>
        </li>
        <li
          onClick={() => {
            handlesidebarclick("MCQS from paragaph");
          }}
        >
          <Link
            to="/paragraph-mcqs"
            className={`nav-link text-black fs-6 ${
              currentSidebar === "MCQS from paragaph" && "active"
            }`}
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#grid"></use>
            </svg>
            MCQS from paragaph
          </Link>
        </li>
        <li
          onClick={() => {
            handlesidebarclick("Dot Point summary");
          }}
        >
          <Link
            to="/dotpoint-summary"
            className={`nav-link text-black fs-6 ${
              currentSidebar === "Dot Point summary" && "active"
            }`}
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#people-circle"></use>
            </svg>
            Dot Point summary
          </Link>
        </li>
      </ul>
      <hr />
    </div>
  );
};

export default Sidebar;
