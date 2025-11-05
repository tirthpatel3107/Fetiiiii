/**
 * Event handler utility functions
 */

/**
 * Handles keyboard events for accessibility (Enter and Space keys)
 * @param {Event} event - Keyboard event
 * @param {Function} callback - Callback function to execute
 */
export const handleKeyboardAccessibility = (event, callback) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    if (callback) {
      callback(event);
    }
  }
};

/**
 * Prevents default and stops propagation for an event
 * @param {Event} event - Event object
 */
export const preventDefaultAndStopPropagation = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

/**
 * Handles click with optional drag detection
 * @param {Event} event - Click event
 * @param {Function} callback - Callback function
 * @param {boolean} hasMoved - Whether drag movement occurred
 * @param {boolean} isDragging - Whether currently dragging
 */
export const handleClickWithDragCheck = (event, callback, hasMoved, isDragging) => {
  if (!hasMoved && !isDragging && callback) {
    callback(event);
  }
};

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a random index from an array
 * @param {Array} array - Array to get random index from
 * @returns {number} Random index
 */
export const randomArrayIndex = (array) => {
  if (!array || array.length === 0) return 0;
  return randomInt(0, array.length - 1);
};

