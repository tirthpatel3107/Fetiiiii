import React from "react";

// hooks
import useResolution from "../../hooks/useResolution";

// utils
import {
  preventDefaultAndStopPropagation,
  handleKeyboardAccessibility,
} from "../../utils/eventUtils";

// styles
import "../../assets/styles/clear-result.css";

/* ClearResult Component */
const ClearResult = ({ onClear, isSidebarOpen = false }) => {
  // Use common resolution detection hook
  const { isMobileOrTablet } = useResolution();

  // Hide button on mobile/tablet when sidebar is open
  const shouldHide = isMobileOrTablet && isSidebarOpen;

  const handleClick = (e) => {
    preventDefaultAndStopPropagation(e);
    onClear();
  };

  return (
    <div className={`clear-result-container ${shouldHide ? "hidden" : ""}`}>
      <button
        className="clear-result-button"
        onClick={handleClick}
        onTouchEnd={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => handleKeyboardAccessibility(e, onClear)}
      >
        Clear Results
      </button>
    </div>
  );
};

export default ClearResult;
