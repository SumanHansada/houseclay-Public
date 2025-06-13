import React, { ReactNode } from "react";

import Carousel2DClient from "./Carousel2DClient";

interface Carousel2DProps {
  children: ReactNode;
  className?: string;
  slideWidth?: number; // Optional fixed width for each slide
  gap?: number; // Gap between slides
  showArrows?: boolean; // Option to hide arrows
  showDots?: boolean; // Option to show/hide dots
  autoScroll?: boolean; // Auto scroll feature
  autoScrollInterval?: number; // Interval for auto scroll in ms
  containerClassName?: string;
}

const Carousel2D = (props: Carousel2DProps) => {
  return <Carousel2DClient {...props} />;
};

export default Carousel2D;
