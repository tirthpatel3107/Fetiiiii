import React, { useRef, useState, useEffect } from "react";

// components
import PlaceCard from "./common/PlaceCard";
import { ANIMATION_DURATION } from "./LeafletMap";

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
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }

    e.preventDefault();
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  /* Handles card click - only trigger if not dragging */
  const handleCardClick = (index) => {
    if (!hasMoved && !isDragging && onCardClick) {
      onCardClick(index);
    }
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
        const cardRect = cardElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate if card is fully visible within the container
        const isCardVisible =
          cardRect.left >= containerRect.left &&
          cardRect.right <= containerRect.right;

        // If card is not fully visible, scroll to center it with synced animation
        if (!isCardVisible) {
          // Get the card's position relative to the scroll container
          const cardOffsetLeft = cardElement.offsetLeft;
          const cardWidth = cardElement.offsetWidth;
          const containerWidth = container.clientWidth;

          // Calculate scroll position to center the card
          const targetScroll = Math.max(
            0,
            cardOffsetLeft - containerWidth / 2 + cardWidth / 2
          );
          const startScroll = container.scrollLeft;
          const distance = targetScroll - startScroll;
          const startTime = performance.now();

          // Custom scroll animation to match map animation duration
          const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            container.scrollLeft = startScroll + distance * easeOut;

            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            }
          };

          requestAnimationFrame(animateScroll);
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
