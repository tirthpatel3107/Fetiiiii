import React, { useRef, useState, useEffect } from "react";

// components
import PlaceCard from "./common/PlaceCard";

// utils
import { ANIMATION, UI } from "../../utils/constants";
import { isElementFullyVisible, calculateCenterScrollPosition, animateScroll } from "../../utils/domUtils";
import { handleClickWithDragCheck } from "../../utils/eventUtils";

// styles
import "../../assets/styles/card.css";

/* PlaceCardWrapper Component */
const PlaceCardWrapper = ({
  cards = [],
  onCardClick,
  selectedCardIndex = null,
}) => {
  const scrollContainerRef = useRef(null);
  const cardRefs = useRef({});
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Use cards prop if available, otherwise use empty array
  const places = cards.length > 0 ? cards : [];

  /* Handles mouse down event to start dragging */
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.add('grabbing');
    }
  };

  /* Handles mouse leave event to stop dragging */
  const handleMouseLeave = () => {
    setIsDragging(false);
    setHasMoved(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.remove('grabbing');
    }
  };

  /* Handles mouse up event to stop dragging */
  const handleMouseUp = () => {
    setIsDragging(false);
    setHasMoved(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.remove('grabbing');
    }
  };

  /* Handles mouse move event for drag scrolling */
  const handleMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;

    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier

    // If movement is significant, mark as moved
    if (Math.abs(walk) > UI.DRAG_MOVEMENT_THRESHOLD) {
      setHasMoved(true);
    }

    e.preventDefault();
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  /* Handles card click - only trigger if not dragging */
  const handleCardClick = (index) => {
    handleClickWithDragCheck(null, () => onCardClick?.(index), hasMoved, isDragging);
  };


  // Scroll to selected card when selectedCardIndex changes
  useEffect(() => {
    if (
      selectedCardIndex !== null &&
      scrollContainerRef.current &&
      cardRefs.current[selectedCardIndex]
    ) {
      const container = scrollContainerRef.current;
      const cardElement = cardRefs.current[selectedCardIndex];

      if (cardElement) {
        // Check if card is fully visible within the container
        const isCardVisible = isElementFullyVisible(cardElement, container);

        // If card is not fully visible, scroll to center it with synced animation
        if (!isCardVisible) {
          const targetScroll = calculateCenterScrollPosition(cardElement, container);
          animateScroll(container, targetScroll, ANIMATION.DURATION);
        }
      }
    }
  }, [selectedCardIndex]);

  return (
    <div
      className="place-card-wrapper"
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {places.map((place, index) => (
        <div
          key={`place-${place.title}-${index}`}
          ref={(ref) => {
            cardRefs.current[index] = ref;
          }}
        >
          <PlaceCard
            indicator={place.indicator}
            visits={place.visits}
            title={place.title}
            selectedCardIndex={selectedCardIndex}
            currnetIndex={index}
            address={place.address}
            category={place.category}
            onClick={() => handleCardClick(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default PlaceCardWrapper;
