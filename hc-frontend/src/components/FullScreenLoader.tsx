"use client";

import React from "react";

interface FullScreenLoaderProps {
  className?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  className = "",
}) => {
  return (
    <div className={`hc-loader fixed inset-0 z-50 bg-white ${className}`}>
      <svg viewBox="0 0 20 20" className="hc-icon" aria-hidden="true">
        {/* House */}
        <path
          className="house"
          d="M7 11.862V18.7a.3.3 0 0 1-.3.3H1.3a.3.3 0 0 1-.3-.3V7.973a.3.3 0 0 1 .115-.235L9.51 1.14a.3.3 0 0 1 .362-.006l9.005 6.603A.3.3 0 0 1 19 7.98V18.7a.3.3 0 0 1-.3.3h-5.4a.3.3 0 0 1-.3-.3v-6.838"
        />
        {/* People */}
        <rect
          className="person left"
          x="6.334"
          y="8.333"
          width="2"
          height="2"
          rx="1"
        />
        <rect
          className="person right"
          x="11.667"
          y="8.333"
          width="2"
          height="2"
          rx="1"
        />
        {/* Hands */}
        <path
          className="hand left-hand"
          d="M7 14.333h2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth=".818"
        />
        <path
          className="hand right-hand"
          d="M11 14.333h2.333"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth=".818"
        />
      </svg>
      <p className="tagline font-inter">
        Find your perfect home, without the hassle.
      </p>
    </div>
  );
};

export default FullScreenLoader;
