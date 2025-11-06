import React, { useState, useEffect } from "react";

// utils
import { LOADING_MESSAGES, ANIMATION } from "../../utils/constants";
import { randomArrayIndex } from "../../utils/eventUtils";

// styles
import "../../assets/styles/loading.css";

/* LoadingUI Component */
const LoadingUI = ({ isVisible = true }) => {
  const messages = LOADING_MESSAGES.UI;
  const [currentMessageIndex, setCurrentMessageIndex] = useState(() =>
    randomArrayIndex(messages),
  );

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, ANIMATION.LOADING_UI_MESSAGE_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [messages.length, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div className="loading-ui-container">
        <div className="loading-ui-content">
          <p className="loading-ui-message">{messages[currentMessageIndex]}</p>
          <div className="loading-ui-dots">
            <div className="loading-ui-dot"></div>
            <div className="loading-ui-dot"></div>
            <div className="loading-ui-dot"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingUI;
