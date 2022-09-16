import React from "react";
import logo from "../../image/logo.png";
import "./AppBar.scss";

function AppBar() {
  return (
    <>
      <nav className="navbar-app">
        <img src={logo} alt="Logo" />
      </nav>
    </>
  );
}

export default AppBar;
