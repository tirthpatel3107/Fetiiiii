import React from "react";
import { useMap } from "react-leaflet";

// images
import PlusIcon from "../../assets/images/plus.svg";
import MinusIcon from "../../assets/images/minus.svg";

// styles
import "../../assets/styles/map-action-button.css";

/* MapActionButton Component*/
const MapActionButton = () => {
  const map = useMap();

  // Handle zoom in
  const handleZoomIn = () => {
    map.zoomIn();
  };

  // Handle zoom out
  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="map-action-button-container arrow-plus-min">
      <button
        className="map-action-button"
        onClick={handleZoomIn}
        aria-label="Zoom in"
        type="button"
      >
        <img src={PlusIcon} alt="Plus Icon" width="15" height="15" />
      </button>
      <button
        className="map-action-button"
        onClick={handleZoomOut}
        aria-label="Zoom out"
        type="button"
      >
        <img src={MinusIcon} alt="Minus Icon" width="15" height="15" />
      </button>
    </div>
  );
};

export default MapActionButton;
