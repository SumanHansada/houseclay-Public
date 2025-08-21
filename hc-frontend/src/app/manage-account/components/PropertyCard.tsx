"use client";

import Image from "next/image";
import { useState, memo } from "react";
import {
  Heart,
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
import { formatINRCurrency } from "@/common/utils";

const StarIcon = StarCircleIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const CrownIcon = CrownIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
const PhoneFilledIcon = PhoneFilledIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const WhatsAppIcon = WhatsAppIconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

export type PropertySummary = {
  id: string;
  category: PropertyCategory;
  title: string;
  society?: string;
  addressLine?: string;
  featured?: boolean;
  exclusive?: boolean;
  contacted?: boolean;
  shortlisted?: boolean;
  images: { src: string; alt?: string }[];
  priceLabel: number;
  priceSub?: string;
  emiLabel?: number | null;
  areaLabel?: number;
  beds?: number | null;
  baths?: number | null;
  facing?: string | null;
  parking?: string | null;
  available?: boolean;

  propertyType?: string | null;
  furnishing?: string | null;
  availableFrom?: string | null;
  preferredTenants?: string | null;
  depositLabel?: number | null;
};

type PropertyCardProps = {
  property: PropertySummary;
  onContact?: (id: string) => void;
  onFavoriteToggle?: (id: string, next: boolean) => void;
};

export default function PropertyCard({
  property,
  onContact,
  onFavoriteToggle,
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
  const [fav, setFav] = useState(!!shortlisted);

  const goTo = (i: number) => setCurr((i + images.length) % images.length);
  const handleFav = () => {
    const next = !fav;
    setFav(next);
    onFavoriteToggle?.(id, next);
  };

  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm p-2 2xl:p-4">
      {/* ---------- Top container: responsive row/column ---------- */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Image / Carousel */}
        <div className="relative w-full lg:w-1/3 rounded-xl overflow-hidden border border-slate-200">
          <div className="relative h-[180px] sm:h-[200px] md:h-[220px] lg:h-full xl:h-[180px] 2xl:h-[220px] w-full">
            <Image
              key={images[curr]?.src}
              src={images[curr]?.src}
              alt={images[curr]?.alt || title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Featured/Exclusive badges */}
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
            ) : null}
          </div>

          {/* Heart Icon for <=2xl */}
          <div className="absolute top-3 right-3 2xl:hidden shrink-0">
            <button
              onClick={handleFav}
              aria-label={fav ? "Remove from favourites" : "Add to favourites"}
              className="grid h-9 w-9 md:h-8 md:w-8 place-items-center rounded-full bg-white bg-opacity-30"
            >
              <Heart
                className={`h-6 w-6 md:h-5 md:w-5 ${fav ? "fill-red-500 text-red-500" : "text-white"}`}
              />
            </button>
          </div>

          {/* Dots */}
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
        <div className="flex-1 min-w-0 flex flex-col lg:gap-3">
          {/* Title + location + actions (actions visible only on ≥2xl) */}
          <div className="flex items-start justify-between gap-2 py-2">
            <div className="min-w-0">
              <h3 className="text-lg lg:text-base 2xl:text-xl font-semibold leading-snug line-clamp-2">
                {title}
              </h3>
              {(society || addressLine) && (
                <p className="mt-1 flex items-center gap-1 text-sm 2xl:text-base text-slate-600">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {society && <>{society}</>}
                    {society && addressLine && <>, </>}
                    {addressLine}
                  </span>
                </p>
              )}
            </div>

            {/* Keep header icon actions only for very wide screens */}
            <div className="hidden 2xl:flex items-center gap-2 shrink-0">
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
            </div>
          </div>

          <hr className="border-slate-200 hidden lg:block" />

          {/* Price / Deposit / Area */}
          <div className="flex text-sm 2xl:text-lg py-2 justify-between sm:px-4 xl:px-8">
            <div className="lg:py-2 px-1 sm:px-2">
              <div className="text-slate-600">Price</div>
              <div className="mt-1 font-semibold">
                {formatINRCurrency(priceLabel)}
              </div>
            </div>
            <div className="lg:py-2 border-l border-r border-slate-200 px-2 sm:px-4 xl:px-8">
              {category === PropertyCategory.RESALE ? (
                <>
                  <div className="text-slate-600">Estimated EMI</div>
                  <div className="mt-1 font-semibold">
                    {emiLabel ? `${formatINRCurrency(emiLabel)}/Month` : "-"}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-slate-600">Deposit</div>
                  <div className="mt-1 font-semibold">
                    {depositLabel ? formatINRCurrency(depositLabel) : "-"}
                  </div>
                </>
              )}
            </div>
            <div className="lg:py-2 px-1 sm:px-2">
              <div className="text-slate-600">Buildup Area</div>
              <div className="mt-1 font-semibold">
                {areaLabel + " Sq ft." || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex mt-4 lg:justify-between">
        <FeatureRow
          category={category}
          beds={beds}
          baths={baths}
          facing={facing}
          parking={parking}
          propertyType={propertyType}
          furnishing={furnishing}
          availableFrom={availableFrom}
          preferredTenants={preferredTenants}
          contacted={!!contacted}
          id={id}
          onContact={onContact}
        />
      </div>

      <div className="flex justify-end mt-2 md:hidden">
        <Actions contacted={!!contacted} id={id} onContact={onContact} />
      </div>
    </article>
  );
}

const Actions = memo(function Actions({
  contacted,
  id,
  onContact,
}: {
  contacted: boolean;
  id: string;
  onContact?: (id: string) => void;
}) {
  if (contacted) {
    return (
      <button
        onClick={() => onContact?.(id)}
        className="shrink-0 rounded-lg bg-red-500 px-4 py-2 text-white font-semibold hover:bg-red-600 active:bg-red-700"
      >
        Contact Owner
      </button>
    );
  }
  return (
    <div className="flex gap-2">
      <button className="border border-red-500 px-2 py-1 rounded-lg flex gap-1 items-center">
        <PhoneFilledIcon width={20} height={20} className="text-red-500" />
        <span>Call</span>
      </button>
      <button className="border border-green-500 px-2 py-1 rounded-lg flex gap-1 items-center">
        <WhatsAppIcon width={30} height={30} className="text-green-500" />
        <span>Whatsapp</span>
      </button>
    </div>
  );
});

function FeatureRow({
  category,
  beds,
  baths,
  facing,
  parking,
  propertyType,
  furnishing,
  availableFrom,
  preferredTenants,
  contacted,
  id,
  onContact,
}: {
  category: PropertyCategory;
  beds?: number | null;
  baths?: number | null;
  facing?: string | null;
  parking?: string | null;
  propertyType?: string | null;
  furnishing?: string | null;
  availableFrom?: string | null;
  preferredTenants?: string | null;
  contacted: boolean;
  id: string;
  onContact?: (id: string) => void;
}) {
  const base = "flex flex-col items-center text-slate-700";
  const horizontalSeparator = "xl:border-l-2 pl-2";

  if (category === PropertyCategory.RESALE) {
    return (
      <div className="flex items-center justify-between gap-5 rounded-xl bg-slate-50 px-3 xl:px-1 2xl:px-3 py-3 w-full">
        <div
          className={`grid w-1/2 xl:w-3/4 grid-cols-[repeat(2,max-content)] xl:grid-cols-[repeat(4,max-content)] justify-between items-center gap-y-4 text-sm xl:text-xs 2xl:text-sm whitespace-nowrap`}
        >
          <div className={`${base} xl:pl-2`}>
            <span className="text-slate-500">Bedrooms</span>
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4" />
              <span className="font-medium">{beds ?? "-"}&nbsp;Bed</span>
            </div>
          </div>
          <div className={`${base} ${horizontalSeparator}`}>
            <span className="text-slate-500">Bathrooms</span>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4" />
              <span className="font-medium">{baths ?? "-"}&nbsp;Bath</span>
            </div>
          </div>
          <div className={`${base} ${horizontalSeparator}`}>
            <span className="text-slate-500">Facing</span>
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              <span className="font-medium">{facing ?? "-"}</span>
            </div>
          </div>
          <div className={`${base} ${horizontalSeparator}`}>
            <span className="text-slate-500">Parking</span>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              <span className="font-medium">{parking ?? "-"}</span>
            </div>
          </div>
        </div>

        <Actions contacted={!!contacted} id={id} onContact={onContact} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 xl:px-1 2xl:px-3 py-3 w-full">
      <div className="grid w-1/2 xl:w-3/4 grid-cols-[repeat(2,max-content)] xl:grid-cols-[repeat(4,max-content)] justify-between items-center gap-y-4 text-sm xl:text-xs 2xl:text-sm whitespace-nowrap">
        <div className={`${base} xl:pl-2`}>
          <span className="text-slate-500">Property Type</span>
          <div className="flex items-center gap-2 lg:gap-1 2xl:gap-2">
            <Building className="h-4 w-4" />
            <span className="font-medium">{propertyType ?? "-"}</span>
          </div>
        </div>
        <div className={`${base} ${horizontalSeparator}`}>
          <span className="text-slate-500">Furnishing</span>
          <div className="flex items-center gap-2 lg:gap-1 2xl:gap-2">
            <BedDouble className="h-4 w-4" />
            <span className="font-medium">{furnishing ?? "-"}</span>
          </div>
        </div>
        <div className={`${base} ${horizontalSeparator}`}>
          <span className="text-slate-500">Available From</span>
          <div className="flex items-center gap-2 lg:gap-1 2xl:gap-2">
            <KeySquare className="h-4 w-4" />
            <span className="font-medium">{availableFrom ?? "-"}</span>
          </div>
        </div>
        <div className={`${base} ${horizontalSeparator}`}>
          <span className="text-slate-500">Preferred Tenants</span>
          <div className="flex items-center gap-2 lg:gap-1 2xl:gap-2">
            <House className="h-4 w-4" />
            <span className="font-medium">{preferredTenants ?? "-"}</span>
          </div>
        </div>
      </div>
      <Actions contacted={!!contacted} id={id} onContact={onContact} />
    </div>
  );
}
