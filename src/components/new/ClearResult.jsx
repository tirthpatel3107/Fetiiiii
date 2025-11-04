import React, { useState, useEffect } from "react";

// styles
import "../../assets/styles/clear-result.css";

/* ClearResult Component */
const ClearResult = ({ onClear, isSidebarOpen = false }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hide button on mobile/tablet when sidebar is open
  const shouldHide = isMobile && isSidebarOpen;

  return (
    <div className={`clear-result-container ${shouldHide ? 'hidden' : ''}`}>
      <button 
        className="clear-result-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClear();
          }
        }}
      >
        Clear Results
      </button>
    </div>
  );
};

export default ClearResult;
