import React from "react";

// styles
import "../../assets/styles/header.css";

/* Header Component */
const Header = ({ onMenuClick, isSidebarOpen }) => {
  return (
    <header className={`app-header ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <button
        className={`hamburger-menu-button ${isSidebarOpen ? "sidebar-open" : ""}`}
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <span className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </header>
  );
};

export default Header;
