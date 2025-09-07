import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import { CONNECT_CARDS } from "@/common/dataConstants";
import Carousel2D from "@/components/Carousel2D";

interface ConnectCardProps {
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
  iconWidth?: number;
  iconHeight?: number;
}

export const ConnectCard: React.FC<ConnectCardProps> = ({
  iconSrc,
  iconAlt,
  title,
  description,
  iconWidth = 150,
  iconHeight = 150,
}) => (
  <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-10 lg:px-6 px-3 py-6 justify-evenly items-center min-h-[380px] md:min-h-[420px]">
    <Image src={iconSrc} alt={iconAlt} width={iconWidth} height={iconHeight} />
    <div className="flex flex-col gap-2 text-center items-center">
      <h1 className="font-semibold lg:text-2xl max-md:text-xl lg:w-4/5 w-11/12">
        {title}
      </h1>
      <p className="text-gray-800 text-balance lg:text-lg max-md:text-lg">
        {description}
      </p>
    </div>
  </div>
);

const HowToUseConnects = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-between md:gap-10 gap-4 xl:px-28 lg:px-14 md:px-14 md:py-20 p-6 bg-gray-100">
      <div className="flex flex-col items-center justify-center md:gap-4 gap-2">
        <h1 className="lg:text-4xl sm:text-3xl text-2xl md:font-bold font-medium text-center">
          How Can You Use Connects?
        </h1>
        <p className="text-center md:text-gray-800 text-gray-600 md:font-light sm:text-xl text-lg lg:w-3/4 md:w-11/12">
          Listing your property has never been easier or more effective.
          Here&apos;s why thousands of property owners trust us:
        </p>
      </div>
      <div className="flex xl:gap-10 lg:gap-6 md:gap-3 max-md:gap-6 justify-between xl:px-12 lg:px-2 max-md:hidden">
        {CONNECT_CARDS.map((card) => (
          <ConnectCard
            key={card.id}
            iconSrc={card.iconSrc}
            iconAlt={card.iconAlt}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
      <div
        role="list"
        className="relative scrollbar-hide flex overflow-x-auto w-full md:hidden"
      >
        <Carousel2D slideWidth={320} gap={4} showDots={true}>
          {CONNECT_CARDS.map((card) => (
            <ConnectCard
              key={card.id}
              iconSrc={card.iconSrc}
              iconAlt={card.iconAlt}
              title={card.title}
              description={card.description}
            />
          ))}
        </Carousel2D>
      </div>
      <button
        className="bg-red-500 text-white text-lg xl:px-6  lg:px-5 lg:py-3 md:px-3 px-3 py-2 rounded-xl size-fit max-md:hidden"
        onClick={() => router.push("/buy-connects")}
      >
        Buy Connects Now
      </button>
    </div>
  );
};

export default HowToUseConnects;
