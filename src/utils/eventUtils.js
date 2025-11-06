/* Handles keyboard events for accessibility (Enter and Space keys) */
export const handleKeyboardAccessibility = (event, callback) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (callback) {
      callback(event);
    }
  }
};

/* Prevents default and stops propagation for an event */
export const preventDefaultAndStopPropagation = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

/* Handles click with optional drag detection */
export const handleClickWithDragCheck = (
  event,
  callback,
  hasMoved,
  isDragging,
) => {
  if (!hasMoved && !isDragging && callback) {
    callback(event);
  }
};

/* Generates a random integer between min and max (inclusive) */
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* Generates a random index from an array */
export const randomArrayIndex = (array) => {
  if (!array || array.length === 0) return 0;
  return randomInt(0, array.length - 1);
};
