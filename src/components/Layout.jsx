import React from "react";
import Danger from "./Danger"; // Import Danger component

const Layout = ({ children }) => {
  return (
    <>
      <div>
        {children}
        <Danger />
      </div>
    </>
  );
};

export default Layout;
