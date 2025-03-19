import React, { useState } from "react";

// Define types for our component props
export interface Neighborhood {
  name: string;
  image: string;
}

interface NeighborhoodCardProps {
  image: string;
  name: string;
  listingType: string;
}

interface NeighborhoodsProps {
  neighborhoods: Neighborhood[];
  listingType: string;
}

const NeighborhoodCard: React.FC<NeighborhoodCardProps> = ({
  image,
  name,
  listingType,
}) => {
  return (
    <div
      role="listitem"
      className="relative h-80 min-w-[280px] overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-105 sm:h-64"
    >
      <img
        src={image}
        alt={`${name} neighborhood`}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
        <div className="absolute bottom-0 left-0 p-6">
          <p className="mb-1 font-light text-gray-50 opacity-90">
            Flats for {listingType} in
          </p>
          <h3 className="text-3xl text-white">{name}</h3>
        </div>
      </div>
    </div>
  );
};

const Neighborhoods: React.FC<NeighborhoodsProps> = ({
  neighborhoods,
  listingType,
}) => {
  return (
    <div className="mx-auto xl:px-40 lg:px-14 px-14 py-20 bg-gray-100">
      <h2 className="mb-6 text-4xl font-bold text-gray-800">
        Popular Neighborhoods
      </h2>

      {/* Scrollable cards container for mobile */}
      <div
        role="list"
        className="no-scrollbar -mx-4 flex overflow-x-auto pb-6 pl-4 sm:hidden"
      >
        {neighborhoods.map((neighborhood, index) => (
          <div key={index} className="mr-4 flex-none">
            <NeighborhoodCard
              image={neighborhood.image}
              name={neighborhood.name}
              listingType={listingType}
            />
          </div>
        ))}
      </div>

      {/* Grid layout for larger screens */}
      <div className="hidden grid-cols-1 gap-6 sm:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {neighborhoods.map((neighborhood, index) => (
          <NeighborhoodCard
            key={index}
            image={neighborhood.image}
            name={neighborhood.name}
            listingType={listingType}
          />
        ))}
      </div>

      {/* Pagination dots for mobile scrolling */}
      <div className="mt-4 flex justify-center space-x-2 sm:hidden">
        {[0, 1, 2, 3, 4].map((dot) => (
          <div
            key={dot}
            className={`h-2 w-2 rounded-full ${
              dot === 0 ? "bg-gray-800" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Neighborhoods;
