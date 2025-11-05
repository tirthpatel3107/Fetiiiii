/**
 * DOM manipulation and utility functions
 */

/**
 * Scrolls an element to the bottom
 * @param {HTMLElement} element - The element to scroll
 * @param {number} [delay=0] - Optional delay in milliseconds
 */
export const scrollToBottom = (element, delay = 0) => {
  if (!element) return;

  const performScroll = () => {
    requestAnimationFrame(() => {
      element.scrollTop = element.scrollHeight;
    });
  };

  if (delay > 0) {
    setTimeout(performScroll, delay);
  } else {
    performScroll();
  }
};

/**
 * Checks if an element is fully visible within its container
 * @param {HTMLElement} element - The element to check
 * @param {HTMLElement} container - The container element
 * @returns {boolean} True if element is fully visible
 */
export const isElementFullyVisible = (element, container) => {
  if (!element || !container) return false;

  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return (
    elementRect.left >= containerRect.left &&
    elementRect.right <= containerRect.right
  );
};

/**
 * Calculates scroll position to center an element in its container
 * @param {HTMLElement} element - The element to center
 * @param {HTMLElement} container - The scroll container
 * @returns {number} Target scroll position
 */
export const calculateCenterScrollPosition = (element, container) => {
  if (!element || !container) return 0;

  const elementOffsetLeft = element.offsetLeft;
  const elementWidth = element.offsetWidth;
  const containerWidth = container.clientWidth;

  return Math.max(
    0,
    elementOffsetLeft - containerWidth / 2 + elementWidth / 2
  );
};

/**
 * Gets computed style value as integer
 * @param {HTMLElement} element - The element
 * @param {string} property - CSS property name
 * @param {number} [defaultValue=0] - Default value if parsing fails
 * @returns {number} Parsed integer value
 */
export const getComputedStyleInt = (element, property, defaultValue = 0) => {
  if (!element) return defaultValue;

  const value = getComputedStyle(element)[property];
  return parseInt(value, 10) || defaultValue;
};

/**
 * Easing function for smooth animations (ease-out cubic)
 * @param {number} progress - Progress value between 0 and 1
 * @returns {number} Eased progress value
 */
export const easeOutCubic = (progress) => {
  return 1 - Math.pow(1 - progress, 3);
};

/**
 * Animated scroll with easing
 * @param {HTMLElement} container - The scroll container
 * @param {number} targetScroll - Target scroll position
 * @param {number} duration - Animation duration in milliseconds
 * @param {Function} [easingFn] - Optional easing function
 */
export const animateScroll = (
  container,
  targetScroll,
  duration,
  easingFn = easeOutCubic
) => {
  if (!container) return;

  const startScroll = container.scrollLeft;
  const distance = targetScroll - startScroll;
  const startTime = performance.now();

  const performAnimation = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easingFn(progress);

    container.scrollLeft = startScroll + distance * eased;

    if (progress < 1) {
      requestAnimationFrame(performAnimation);
    }
  };

  requestAnimationFrame(performAnimation);
};

