import React from "react";

const LoadingSpinner = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      <svg
        className="w-full h-full max-w-[40px] max-h-[40px] sm:max-w-[60px] sm:max-h-[60px] md:max-w-[80px] md:max-h-[80px] lg:max-w-[100px] lg:max-h-[100px]"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle cx="75" cy="50" r="6.39718" fill="#ffffff">
          <animate
            attributeName="r"
            values="4.8;4.8;8;4.8;4.8"
            times="0;0.1;0.2;0.3;1"
            dur="1s"
            repeatCount="indefinite"
            begin="-0.875s"
          ></animate>
        </circle>
        <circle cx="67.678" cy="67.678" fill="#ffffff" r="4.8">
          <animate
            attributeName="r"
            values="4.8;4.8;8;4.8;4.8"
            times="0;0.1;0.2;0.3;1"
            dur="1s"
            repeatCount="indefinite"
            begin="-0.75s"
          ></animate>
        </circle>
        <circle cx="50" cy="75" fill="#ffffff" r="4.8">
          <animate
            attributeName="r"
            values="4.8;4.8;8;4.8;4.8"
            times="0;0.1;0.2;0.3;1"
            dur="1s"
            repeatCount="indefinite"
            begin="-0.625s"
          ></animate>
        </circle>
        <circle cx="32.322" cy="67.678" fill="#ffffff" r="4.8">
          <animate
            attributeName="r"
            values="4.8;4.8;8;4.8;4.8"
            times="0;0.1;0.2;0.3;1"
            dur="1s"
            repeatCount="indefinite"
            begin="-0.5s"
          ></animate>
        </circle>
        <circle cx="25" cy="50" fill="#ffffff" r="4.8">
          <animate
            attributeName="r"
            values="4.8;4.8;8;4.8;4.8"
            times="0;0.1;0.2;0.3;1"
            dur="1s"
            repeatCount="indefinite"
            begin="-0.375s"
          ></animate>
        </circle>
        <circle cx="32.322" cy="32.322" fill="#ffffff" r="4.80282">
          <animate
            attributeName="r"
            values="4.8;4.8;8;4.8;4.8"
            times="0;0.1;0.2;0.3;1"
            dur="1s"
            repeatCount="indefinite"
            begin="-0.25s"
          ></animate>
        </circle>
        <circle cx="50" cy="25" fill="#ffffff" r="6.40282">
          <animate
            attributeName="r"
            values="4.8;4.8;8;4.8;4.8"
            times="0;0.1;0.2;0.3;1"
            dur="1s"
            repeatCount="indefinite"
            begin="-0.125s"
          ></animate>
        </circle>
        <circle cx="67.678" cy="32.322" fill="#ffffff" r="7.99718">
          <animate
            attributeName="r"
            values="4.8;4.8;8;4.8;4.8"
            times="0;0.1;0.2;0.3;1"
            dur="1s"
            repeatCount="indefinite"
            begin="0s"
          ></animate>
        </circle>
      </svg>
    </div>
  );
};

export default LoadingSpinner;

// <div className="d-flex justify-content-center spinner">
//       <div
//         className="spinner-border m-5 text-secondary"
//         style={{ width: "3rem", height: "3rem" }}
//         role="status"
//       >
//         <span className="visually-hidden">Loading...</span>
//       </div>
//     </div>
