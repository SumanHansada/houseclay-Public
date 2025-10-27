import React from "react";

import { Neighbourhood } from "@/interfaces/Neighbourhood";
import { ImageWithLoader } from "@/utility-components";

import Carousel2D from "./Carousel2D";

interface NeighbourhoodCardProps {
  name: string;
  imgURL: string;
}

interface NeighbourhoodsProps {
  neighbourhoods: Neighbourhood[];
}

const NeighbourhoodCard: React.FC<NeighbourhoodCardProps> = ({
  name,
  imgURL,
}) => {
  return (
    <div
      role="listitem"
      className="relative max-md:h-96 md:aspect-square max-w-[280px] max-md:min-w-[245px] overflow-hidden rounded-lg shadow-md transition-transform duration-300 md:hover:scale-105"
    >
      <ImageWithLoader
        src={imgURL}
        alt={`${name} neighbourhood`}
        className="object-cover"
        fill
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent max-md:from-transparent max-md:to-black/60">
        <div className="absolute bottom-0 max-md:top-0 left-0 p-6">
          <p className="mb-1 font-light text-gray-50 opacity-90 font-nunito">
            Flats for Rent in
          </p>
          <p className="text-3xl text-white font-nunito">{name}</p>
        </div>
      </div>
    </div>
  );
};

const Neighbourhoods: React.FC<NeighbourhoodsProps> = ({ neighbourhoods }) => {
  return (
    <div className="mx-auto xl:px-28 lg:px-14 md:px-14 py-20 max-md:py-10 bg-gray-100">
      <h1 className="mb-6 max-md:px-6 text-3xl max-md:text-2xl font-bold text-gray-800">
        Popular Neighbourhoods
      </h1>

      {/* Scrollable cards container for mobile */}
      <div
        role="list"
        className="scrollbar-hide flex overflow-x-auto md:hidden"
      >
        <Carousel2D
          slideWidth={245}
          gap={4}
          showDots={true}
          showArrows={true}
          containerClassName="px-6"
        >
          {neighbourhoods.map((neighbourhood, index) => (
            <div key={index}>
              <NeighbourhoodCard
                name={neighbourhood.name}
                imgURL={neighbourhood.imgURL}
              />
            </div>
          ))}
        </Carousel2D>
      </div>

      {/* Grid layout for larger screens */}
      <div className="grid xl:grid-cols-[repeat(auto-fill,minmax(225px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 max-md:hidden">
        {neighbourhoods.map((neighbourhood, index) => (
          <NeighbourhoodCard
            key={index}
            name={neighbourhood.name}
            imgURL={neighbourhood.imgURL}
          />
        ))}
      </div>
    </div>
  );
};

export default Neighbourhoods;
