// src/carousel.tsx

import React, { useState } from 'react'

interface CarouselProps {
  children: React.ReactNode[]
}

const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const next = (): void => {
    setCurrentIndex((prev: number): number => 
      (prev + 1) % children.length
    )
  }

  const prev = (): void => {
    setCurrentIndex((prev: number): number => 
      (prev - 1 + children.length) % children.length
    )
  }

  return (
    <div className="carousel">
      <button onClick={prev} className="nav-btn">Prev</button>
      <div className="carousel-content">
        {children[currentIndex]}
      </div>
      <button onClick={next} className="nav-btn">Next</button>
    </div>
  )
}

export default Carousel
