import React, { useState, useEffect } from "react";

// styles
import "../../assets/styles/loading.css";

const messages = [
  "Checking where everyone's riding…",
  "Analyzing millions of Fetii trips…",
  "Fetii AI is thinking…",
  "Tracking the pulse of the city…",
  "Finding where the crowd's heading…",
];

const LoadingUI = ({ isVisible = true }) => {
  const min = 0;
  const max = messages.length - 1;
  const randomStartIndex = Math.floor(Math.random() * (max - min + 1)) + min;
  const [currentMessageIndex, setCurrentMessageIndex] = useState(randomStartIndex);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

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
