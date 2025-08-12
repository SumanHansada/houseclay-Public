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
  Building,
  KeySquare,
  House,
} from "lucide-react";
import { PropertyCategory } from "@/common/enums";
import StarCircleIconSvg from "public/icons/star-circle.svg";
import CrownIconSvg from "public/icons/crown.svg";
import PhoneFilledIconSvg from "public/icons/phone-filled.svg";
import WhatsAppIconSvg from "public/icons/whatsapp.svg";

const StarIcon = StarCircleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const CrownIcon = CrownIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const PhoneFilledIcon = PhoneFilledIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const WhatsAppIcon = WhatsAppIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

export type PropertySummary = {
  id: string;
  category: PropertyCategory; // use the enum, not string
  title: string;
  society?: string;
  addressLine?: string;
  featured?: boolean;
  exclusive?: boolean; // ensure only one of featured/exclusive is true
  contacted?: boolean;
  shortlisted?: boolean;
  images: { src: string; alt?: string }[];
  priceLabel: string;
  priceSub?: string;
  emiLabel?: string | null; // null for RENT/FLATMATE
  areaLabel?: string;
  beds?: number | null;
  baths?: number | null;
  facing?: string | null;
  parking?: string | null;
  available?: boolean;

  propertyType?: string | null;
  furnishing?: string | null;
  availableFrom?: string | null;
  preferredTenants?: string | null;
  depositLabel?: string | null;
};

type PropertyCardProps = {
  property: PropertySummary;
  onContact?: (id: string) => void;
  onFavoriteToggle?: (id: string, next: boolean) => void;
  testId?: string;
};

export default function PropertyCard({
  property,
  onContact,
  onFavoriteToggle,
  testId,
}: PropertyCardProps) {
  const {
    id,
    category,
    title,
    society,
    addressLine,
    featured,
    exclusive,
    shortlisted,
    contacted,
    images,
    priceLabel,
    priceSub,
    emiLabel,
    areaLabel,
    beds,
    baths,
    facing,
    parking,
    depositLabel,
    propertyType,
    furnishing,
    availableFrom,
    preferredTenants,
  } = property;

  const [curr, setCurr] = useState(0);
  const [fav, setFav] = useState(shortlisted);

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

          <div className="absolute left-3 top-3">
            {featured ? (
              <span className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 py-1 text-sm">
                <StarIcon width={18} height={18} className="text-red-500" />
                Featured
              </span>
            ) : exclusive ? (
              <span className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 py-1 text-sm">
                <CrownIcon />
                Exclusive
              </span>
            ) : (
              <></>
            )}
          </div>

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
          {/* Price + Estimated Emi/Deposit + Buildup Area */}
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
              {category === PropertyCategory.RESALE ? (
                <>
                  <div className="text-slate-600">Estimated EMI</div>
                  <div className="mt-1 font-semibold">{emiLabel || "-"}</div>
                </>
              ) : (
                <>
                  <div className="text-slate-600">Deposit</div>
                  <div className="mt-1 font-semibold">
                    {depositLabel || "-"}
                  </div>
                </>
              )}
            </div>
            <div className="py-2 sm:px-4">
              <div className="text-slate-600">Buildup Area</div>
              <div className="mt-1 font-semibold">{areaLabel || "-"}</div>
            </div>
          </div>

          {/* Bedrooms + Bathrooms + Facing + Parking */}
          <div className="mt-4 flex items-center justify-between gap-5 rounded-xl bg-slate-50 px-3 py-3">
            {category === PropertyCategory.RESALE ? (
              <div className="grid w-2/3 grid-cols-[repeat(2,max-content)] md:grid-cols-[repeat(4,max-content)] justify-between items-center gap-y-2 text-sm whitespace-nowrap">
                <div className="flex flex-col items-center text-slate-700 pl-2">
                  <span className="text-slate-500">Bedrooms</span>
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4" />
                    <span className="font-medium">{beds ?? "-"}&nbsp;Bed</span>
                  </div>
                </div>
                <div className="flex flex-col items-center text-slate-700 border-l-2 pl-2">
                  <span className="text-slate-500">Bathrooms</span>
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4" />
                    <span className="font-medium">
                      {baths ?? "-"}&nbsp;Bath
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center text-slate-700 border-l-2 pl-2">
                  <span className="text-slate-500">Facing</span>
                  <div className="flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    <span className="font-medium">{facing ?? "-"}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center text-slate-700 border-l-2 pl-2">
                  <span className="text-slate-500">Parking</span>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span className="font-medium">{parking ?? "-"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid w-full grid-cols-[repeat(2,max-content) md:grid-cols-[repeat(4,max-content)] justify-between items-center gap-y-2 text-sm whitespace-nowrap">
                <div className="flex flex-col items-center text-slate-700">
                  <span className="text-slate-500">Property Type</span>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span className="font-medium">{propertyType ?? "-"}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center text-slate-700 border-l-2 pl-2">
                  <span className="text-slate-500">Furnishing</span>
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4" />
                    <span className="font-medium">{furnishing ?? "-"}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center text-slate-700 border-l-2 pl-2">
                  <span className="text-slate-500">Available From</span>
                  <div className="flex items-center gap-2">
                    <KeySquare className="h-4 w-4" />
                    <span className="font-medium">{availableFrom ?? "-"}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center text-slate-700 border-l-2 pl-2">
                  <span className="text-slate-500">Preferred Tenants</span>
                  <div className="flex items-center gap-2">
                    <House className="h-4 w-4" />
                    <span className="font-medium">
                      {preferredTenants ?? "-"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {contacted ? (
              <button
                onClick={() => onContact?.(id)}
                className="shrink-0 rounded-lg bg-red-500 px-4 py-2 text-white font-semibold hover:bg-red-600 active:bg-red-700"
              >
                Contact Owner
              </button>
            ) : (
              <div className="flex gap-2">
                <button className="border border-red-500 px-2 py-1 rounded-lg flex gap-1 items-center">
                  <PhoneFilledIcon
                    width={20}
                    height={20}
                    className="text-red-500"
                  />
                  <span>Call</span>
                </button>
                <button className="border border-green-500 px-2 py-1 rounded-lg flex gap-1 items-center">
                  <WhatsAppIcon
                    width={30}
                    height={30}
                    className="text-green-500"
                  />
                  <span>Whatsapp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
