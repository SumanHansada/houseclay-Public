"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Heart,
  MoreVertical,
  MapPin,
  BedDouble,
  Bath,
  Compass,
  Car,
  Bike,
} from "lucide-react";
import { PropertyCategory } from "@/common/enums";
import StarCircleIconSvg from "public/icons/star-circle.svg";

const StarIcon = StarCircleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

export type PropertySummary = {
  id: string;
  category: PropertyCategory;
  title: string;
  society?: string;
  addressLine?: string;
  featured?: boolean;
  images: { src: string; alt?: string }[];
  priceLabel: string;
  priceSub?: string;
  emiLabel?: string;
  areaLabel?: string;
  beds?: number;
  baths?: number;
  facing?: string;
  parking?: string;
  available?: boolean;
};

type PropertyCardProps = {
  property: PropertySummary;
  onContact?: (id: string) => void;
  onFavoriteToggle?: (id: string, next: boolean) => void;
  initiallyFavorited?: boolean;
  testId?: string;
};

export default function PropertyCard({
  property,
  onContact,
  onFavoriteToggle,
  initiallyFavorited = false,
  testId,
}: PropertyCardProps) {
  const {
    id,
    title,
    society,
    addressLine,
    featured,
    images,
    priceLabel,
    priceSub,
    emiLabel,
    areaLabel,
    beds,
    baths,
    facing,
    parking,
  } = property;

  const [curr, setCurr] = useState(0);
  const [fav, setFav] = useState(initiallyFavorited);

  const goTo = (i: number) => setCurr((i + images.length) % images.length);
  const handleFav = () => {
    const next = !fav;
    setFav(next);
    onFavoriteToggle?.(id, next);
  };

  return (
    <article
      className="rounded-xl border border-gray-200 bg-white shadow-sm p-4"
      data-testid={testId}
    >
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
        {/* Left: Image / Carousel */}
        <div className="relative rounded-xl overflow-hidden border border-slate-200">
          <div className="relative h-[220px] w-full">
            <Image
              key={images[curr]?.src}
              src={images[curr]?.src}
              alt={images[curr]?.alt || title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 320px, 100vw"
              priority
            />
          </div>

          {featured && (
            <div className="absolute left-3 top-3">
              <span className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 py-1 text-sm">
                <StarIcon width={18} height={18} className="text-red-500" />
                Featured
              </span>
            </div>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    curr === i ? "w-3 bg-white" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex flex-col">
          {/* Title + Society + Address Line */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-lg md:text-xl font-semibold leading-snug line-clamp-2">
                {title}
              </h3>
              {(society || addressLine) && (
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {society && <>{society}</>}
                    {society && addressLine && <>, </>}
                    {addressLine}
                  </span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFav}
                aria-label={
                  fav ? "Remove from favourites" : "Add to favourites"
                }
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 hover:bg-slate-50"
              >
                <Heart
                  className={`h-5 w-5 ${fav ? "fill-red-500 text-red-500" : "text-slate-700"}`}
                />
              </button>
              <button
                aria-label="More actions"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 hover:bg-slate-50"
              >
                <MoreVertical className="h-5 w-5 text-slate-700" />
              </button>
            </div>
          </div>
          <hr className="my-4 border-slate-200" />
          {/* Price + Estimated Emi + Buildup Area */}
          <div className="grid grid-cols-1 sm:grid-cols-3 text-sm">
            <div className="py-2">
              <div className="text-slate-600">Price</div>
              <div className="mt-1 font-semibold">
                {priceLabel}{" "}
                {priceSub && (
                  <span className="font-normal text-slate-500">{priceSub}</span>
                )}
              </div>
            </div>
            <div className="py-2 sm:border-l sm:border-r sm:border-slate-200 sm:px-4">
              <div className="text-slate-600">Estimated EMI</div>
              <div className="mt-1 font-semibold">{emiLabel || "-"}</div>
            </div>
            <div className="py-2 sm:px-4">
              <div className="text-slate-600">Buildup Area</div>
              <div className="mt-1 font-semibold">{areaLabel || "-"}</div>
            </div>
          </div>

          {/* Bedrooms + Bathrooms + Facing + Parking */}
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <BedDouble className="h-4 w-4" />
                <span className="text-slate-500">Bedrooms</span>
                <span className="font-medium">{beds ?? "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Bath className="h-4 w-4" />
                <span className="text-slate-500">Bathrooms</span>
                <span className="font-medium">{baths ?? "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Compass className="h-4 w-4" />
                <span className="text-slate-500">Facing</span>
                <span className="font-medium">{facing ?? "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <div className="flex -space-x-1 items-center">
                  <Car className="h-4 w-4" />
                </div>
                <span className="text-slate-500">Parking</span>
                <span className="font-medium text-nowrap">
                  {parking ?? "-"}
                </span>
              </div>
            </div>

            <button
              onClick={() => onContact?.(id)}
              className="shrink-0 rounded-lg bg-red-500 px-4 py-2 text-white font-semibold hover:bg-red-600 active:bg-red-700"
            >
              Contact Owner
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
