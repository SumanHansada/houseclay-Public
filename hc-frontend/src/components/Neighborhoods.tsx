import Image from "next/image";
import React from "react";

// Define types for our component props
export interface Neighbourhood {
  name: string;
  image: string;
}

interface NeighbourhoodCardProps {
  image: string;
  name: string;
  listingType: string;
}

interface NeighbourhoodsProps {
  neighbourhoods: Neighbourhood[];
  listingType: string;
}

const NeighbourhoodCard: React.FC<NeighbourhoodCardProps> = ({
  image,
  name,
  listingType,
}) => {
  return (
    <div
      role="listitem"
      className="relative h-64 max-w-[280px] max-md:min-w-[245px] overflow-hidden rounded-lg shadow-md transition-transform duration-300 md:hover:scale-105 max-md:h-96"
    >
      <Image
        src={image}
        alt={`${name} neighbourhood`}
        className="h-full w-full object-cover"
        layout="fill"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent max-md:from-transparent max-md:to-black/60">
        <div className="absolute bottom-0 max-md:top-0 left-0 p-6">
          <p className="mb-1 font-light text-gray-50 opacity-90 font-nunito">
            Flats for {listingType} in
          </p>
          <h3 className="text-3xl text-white font-nunito">{name}</h3>
        </div>
      </div>
    </div>
  );
};

const Neighbourhoods: React.FC<NeighbourhoodsProps> = ({
  neighbourhoods,
  listingType,
}) => {
  return (
    <div className="mx-auto xl:px-28 lg:px-14 md:px-14 px-8 py-20 max-md:py-10 bg-gray-100">
      <h1 className="mb-6 text-3xl max-md:text-2xl font-bold text-gray-800">
        Popular Neighbourhoods
      </h1>

      {/* Scrollable cards container for mobile */}
      <div
        role="list"
        className="scrollbar-hide flex overflow-x-auto pb-6 md:hidden"
      >
        {neighbourhoods.map((neighbourhood, index) => (
          <div key={index} className="mr-4 flex-none">
            <NeighbourhoodCard
              image={neighbourhood.image}
              name={neighbourhood.name}
              listingType={listingType}
            />
          </div>
        ))}
      </div>

      {/* Grid layout for larger screens */}
      <div className="grid gap-3 md:gap-3  lg:gap-4  xl:gap-4 2xl:gap-5 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]  max-md:hidden">
        {neighbourhoods.map((neighbourhood, index) => (
          <NeighbourhoodCard
            key={index}
            image={neighbourhood.image}
            name={neighbourhood.name}
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

export default Neighbourhoods;
