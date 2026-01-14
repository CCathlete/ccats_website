// src/carousel.tsx

import React, { useEffect, useState } from 'react';

interface CarouselProps {
  cards: React.ReactNode[];
}

const Carousel: React.FC<CarouselProps> = ({ cards }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        setIndex(i => Math.min(i + 1, cards.length - 1));
      } else {
        setIndex(i => Math.max(i - 1, 0));
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setIndex(i => Math.min(i + 1, cards.length - 1));
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setIndex(i => Math.max(i - 1, 0));
      }
    };

    window.addEventListener('wheel', onWheel);
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, [cards.length]);

  return (
    <div
      style={{
        height: '100%',
        transform: `translateY(-${index * 100}vh)`,
        transition: 'transform 0.4s ease',
      }}
    >
      {cards.map((card, i) => (
        <div key={i} style={{ height: '100vh' }}>
          {card}
        </div>
      ))}
    </div>
  );
};

export default Carousel;
