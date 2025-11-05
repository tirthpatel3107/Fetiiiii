import React, { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import MapActionButton from "./MapActionButton";

// utils
import { MAP_CONFIG, MARKER_CONFIG, TILE_CONFIG } from "../../utils/constants";

// styles
import "../../assets/styles/leaflet-map.css";

// Export for backward compatibility
export const ANIMATION_DURATION = MAP_CONFIG.ANIMATION_DURATION;
export const POPUP_DELAY = MAP_CONFIG.POPUP_DELAY;

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Create purple circular markers with white numbers
const createCustomIcon = (indicator) => {
  const size = MARKER_CONFIG.SIZE;
  const purpleColor = MARKER_CONFIG.COLOR;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${purpleColor};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 500;
        font-family: 'Open Runde', sans-serif;
        font-size: 13px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(0deg, var(--Purple-1, #981FF5) 0%, var(--Purple-1, #981FF5) 100%), #D9D9D9;
        background-blend-mode: normal;
      ">${indicator}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Component to handle map bounds adjustment when places are added
function MapBoundsController({ places }) {
  const map = useMap();

  useEffect(() => {
    if (places && places.length > 0) {
      const validPlaces = places.filter((p) => p.lat && p.lng);
      if (validPlaces.length > 0) {
        const bounds = L.latLngBounds(validPlaces.map((p) => [p.lat, p.lng]));
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
        });
      }
    }
  }, [places, map]);

  return null;
}

// Component to handle marker selection and popup opening
function MapMarkerController({ places, selectedMarkerId, markerRefs }) {
  const map = useMap();

  useEffect(() => {
    // Focus on selected marker when selectedMarkerId changes
    if (selectedMarkerId !== null && places && places[selectedMarkerId]) {
      const selectedPlace = places[selectedMarkerId];
      if (selectedPlace.lat && selectedPlace.lng) {
        // Close all existing popups first
        Object.values(markerRefs.current).forEach((marker) => {
          if (marker) {
            marker.closePopup();
          }
        });

        // Pan and zoom to selected marker
        map.setView([selectedPlace.lat, selectedPlace.lng], 15, {
          animate: true,
          duration: MAP_CONFIG.ANIMATION_DURATION / 1000, // Convert ms to seconds
        });

        // Open popup for selected marker - synced with animation
        setTimeout(() => {
          const marker = markerRefs.current[selectedMarkerId];
          if (marker) {
            marker.openPopup();
          }
        }, MAP_CONFIG.POPUP_DELAY);
      }
    }
  }, [selectedMarkerId, places, map, markerRefs]);

  return null;
}

// Component to handle map clicks and close popups when clicking outside
function MapClickHandler({ markerRefs, onMapClick }) {
  const map = useMap();

  useEffect(() => {
    const handleMapClick = (e) => {
      // Check if click target is not a marker or popup
      const target = e.originalEvent.target;
      const isMarker = target.closest('.custom-marker');
      const isPopup = target.closest('.leaflet-popup');
      
      // If clicking on the map (not on marker or popup), close all popups
      if (!isMarker && !isPopup) {
        Object.values(markerRefs.current).forEach((marker) => {
          if (marker) {
            marker.closePopup();
          }
        });
        
        // Reset selected marker ID if callback provided
        if (onMapClick) {
          onMapClick();
        }
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, markerRefs, onMapClick]);

  return null;
}

const LeafletMap = ({ places = [], selectedMarkerId = null, onMarkerDeselect = null, onMarkerSelect = null }) => {
  // Default center coordinates (Austin, TX)
  const center = MAP_CONFIG.DEFAULT_CENTER;
  const zoom = MAP_CONFIG.DEFAULT_ZOOM;

  // Ref to store marker references
  const markerRefs = useRef({});

  // Filter places that have coordinates (lat and lng from mockResponse)
  const placesWithCoords = useMemo(() => {
    return places.filter((place) => place.lat && place.lng);
  }, [places]);

  // Get Stadia Maps API key from environment variable
  const stadiaMapsApiKey = import.meta.env.VITE_STADIAMAPS_API_KEY || '';
  
  // Build tile URL with API key if available
  const tileUrl = stadiaMapsApiKey 
    ? `${TILE_CONFIG.BASE_URL}?api_key=${stadiaMapsApiKey}`
    : TILE_CONFIG.BASE_URL;

  return (
    <div className="leaflet-map-container">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
      >
        <TileLayer
          attribution={TILE_CONFIG.ATTRIBUTION}
          url={tileUrl}
          maxZoom={MAP_CONFIG.MAX_ZOOM}
          minZoom={MAP_CONFIG.MIN_ZOOM}
        />

        <MapBoundsController places={placesWithCoords} />

        <MapMarkerController 
          places={placesWithCoords} 
          selectedMarkerId={selectedMarkerId}
          markerRefs={markerRefs}
        />

        <MapClickHandler 
          markerRefs={markerRefs}
          onMapClick={onMarkerDeselect}
        />

        <MapActionButton />

        {/* Markers for each place */}
        {placesWithCoords.map((place, index) => (
          <Marker
            key={`marker-${place.title}-${index}`}
            ref={(ref) => {
              markerRefs.current[index] = ref;
            }}
            position={[place.lat, place.lng]}
            icon={createCustomIcon(place.indicator)}
            eventHandlers={{
              click: (e) => {
                // Close all other popups first
                Object.values(markerRefs.current).forEach((marker, idx) => {
                  if (marker && idx !== index) {
                    marker.closePopup();
                  }
                });
                // Open this marker's popup
                e.target.openPopup();
                // Notify parent component about marker selection for card scrolling
                if (onMarkerSelect) {
                  onMarkerSelect(index);
                }
              },
            }}
          >
            <Popup closeButton={false} autoClose={false} closeOnClick={false}>
              <div className="custom-popup-content">
                <div className="popup-header">
                  <div className="popup-indicator-circle">
                    <span className="popup-indicator-number">{place.indicator}</span>
                  </div>
                  <div className="popup-visits-badge">
                    {place.visits} Visits
                  </div>
                </div>
                <div className="popup-body">
                  <h3 className="popup-title">{place.title}</h3>
                  <p className="popup-address">{place.address}</p>
                  <p className="popup-category">{place.category}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
