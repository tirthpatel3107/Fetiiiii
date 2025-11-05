/**
 * Application-wide constants
 */

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [30.2672, -97.7431], // Austin, TX coordinates
  DEFAULT_ZOOM: 13,
  MAX_ZOOM: 19,
  MIN_ZOOM: 3,
  ANIMATION_DURATION: 800, // milliseconds for map pan and card scroll
  POPUP_DELAY: 700, // Start opening popup during animation (70% through)
};

// Animation Constants
export const ANIMATION = {
  DURATION: MAP_CONFIG.ANIMATION_DURATION,
  POPUP_DELAY: MAP_CONFIG.POPUP_DELAY,
  LOADING_MESSAGE_ROTATION_INTERVAL: 2000, // milliseconds (Sidebar mobile)
  LOADING_UI_MESSAGE_ROTATION_INTERVAL: 3000, // milliseconds (LoadingUI)
};

// Message Types
export const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
};

// UI Constants
export const UI = {
  TEXTAREA_MAX_ROWS: 5,
  TEXTAREA_DEFAULT_LINE_HEIGHT: 20,
  SCROLL_THRESHOLD: 20, // pixels for scroll detection
  SCROLL_DELAY: 50, // milliseconds for scroll to bottom delay
  DRAG_MOVEMENT_THRESHOLD: 5, // pixels to determine if drag moved
};

// Quick Suggestions
export const QUICK_SUGGESTIONS = [
  "What are the top 5 drop-off locations?",
  "Where are college kids frequenting on weekdays?",
  "How far are riders normally traveling to get to De Nada?",
];

// Loading Messages
export const LOADING_MESSAGES = {
  SIDEBAR: [
    "Checking where everyone's riding",
    "Analyzing millions of Fetii trips",
    "Fetii AI is thinking",
    "Tracking the pulse of the city",
    "Finding where the crowd's heading",
  ],
  UI: [
    "Checking where everyone's riding…",
    "Analyzing millions of Fetii trips…",
    "Fetii AI is thinking…",
    "Tracking the pulse of the city…",
    "Finding where the crowd's heading…",
  ],
};

// Map Marker Configuration
export const MARKER_CONFIG = {
  SIZE: 24,
  COLOR: "#981FF5", // Primary purple color
};

// Map Tile Configuration
export const TILE_CONFIG = {
  BASE_URL: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  ATTRIBUTION: "",
};

