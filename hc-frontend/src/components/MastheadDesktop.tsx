"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BedDouble } from "lucide-react";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { PropertyCategory } from "@/common/enums";
import HomeSearchBar from "@/components/HomeSearchBar";
import { setPropertyCategory } from "@/store/propertySearchSlice";
import { RootState } from "@/store/store";
import { InfiniteScroller, SvgIcon } from "@/utility-components";

const tabTween = {
  type: "tween" as const,
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1] as const,
};

const mastheadTabs = [
  {
    category: PropertyCategory.RENT,
    label: "Flats for rent",
    kind: "rent" as const,
  },
  {
    category: PropertyCategory.FLATMATE,
    label: "Find rooms",
    kind: "flatmate" as const,
  },
];

const MastHeadDesktop = () => {
  const reduceMotion = useReducedMotion();
  const propertyCategory = useSelector(
    (state: RootState) => state.propertySearch.propertyCategory,
  );
  const dispatch = useDispatch();

  const activeTabIndex = Math.max(
    0,
    mastheadTabs.findIndex((t) => t.category === propertyCategory),
  );

  const tabsRowRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const updateUnderline = useCallback(() => {
    const row = tabsRowRef.current;
    const btn = tabButtonRefs.current[activeTabIndex];
    if (!row || !btn) return;
    const rowRect = row.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setUnderline({
      left: btnRect.left - rowRect.left,
      width: btnRect.width,
    });
  }, [activeTabIndex]);

  useLayoutEffect(() => {
    updateUnderline();
  }, [updateUnderline, propertyCategory]);

  useLayoutEffect(() => {
    const ro = new ResizeObserver(() => updateUnderline());
    if (tabsRowRef.current) ro.observe(tabsRowRef.current);
    tabButtonRefs.current.forEach((el) => {
      if (el) ro.observe(el);
    });
    return () => ro.disconnect();
  }, [updateUnderline]);

  return (
    <>
      <div className="absolute inset-0">
        <img
          src="https://cdn.houseclay.com/public/images/banner-background.webp"
          srcSet="
          https://cdn.houseclay.com/public/images/banner-background-640w.webp 640w,
          https://cdn.houseclay.com/public/images/banner-background-768w.webp 768w,
          https://cdn.houseclay.com/public/images/banner-background-1024w.webp 1024w,
          https://cdn.houseclay.com/public/images/banner-background-1280w.webp 1280w,
          https://cdn.houseclay.com/public/images/banner-background-2560w.webp 2560w"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
          alt="Houseclay Banner Background"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute h-full flex flex-col justify-center xl:pl-24 lg:pl-12 pl-8 2xl:w-[45%] lg:w-3/5 md:w-8/12 w-4/5">
        {/* Headings */}
        <div className="max-w-md mb-8">
          <h2 className="flex flex-col xl:text-5xl lg:text-4xl text-3xl max-lg:flex-col text-gray-800 mb-1 gap-2">
            <span className="font-semibold text-nowrap">
              Find Your Perfect Home,
            </span>
            <span className="font-semibold text-nowrap">
              Without the Hassle
            </span>
          </h2>
        </div>

        {/* Animated Text Scroller */}
        <InfiniteScroller
          intervalMs={3000}
          className="mb-6 -mt-2 ml-2"
          itemClassName="font-light lg:text-lg text-base justify-start"
        />

        {/* Tabs — original underline look; red accent is one sliding bar (measured) */}
        <div
          ref={tabsRowRef}
          className="relative mb-4 flex max-w-5xl justify-start px-2"
        >
          <motion.div
            className="pointer-events-none absolute bottom-0 z-10 h-0.5 bg-red-600"
            initial={false}
            animate={{ left: underline.left, width: underline.width }}
            transition={
              reduceMotion ? { duration: 0, ease: "linear" } : tabTween
            }
            aria-hidden
          />
          {mastheadTabs.map((tab, index) => {
            const active = propertyCategory === tab.category;
            return (
              <button
                key={tab.category}
                ref={(el) => {
                  tabButtonRefs.current[index] = el;
                }}
                type="button"
                onClick={() => dispatch(setPropertyCategory(tab.category))}
                aria-pressed={active}
                className={`flex items-center gap-2 px-2 py-2 text-base lg:text-lg border-b-2 border-gray-300 ${
                  active ? "text-red-600" : "text-gray-700"
                }`}
              >
                {tab.kind === "rent" ? (
                  <SvgIcon
                    iconSize="small"
                    name="instant-access"
                    size={24}
                    className={active ? "text-red-600" : "text-gray-700"}
                  />
                ) : (
                  <BedDouble
                    className={`size-5 ${active ? "text-red-600" : "text-gray-700"}`}
                  />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
          {/* <button
            className={`px-6 py-2 text-lg border-b-2 border-gray-300 ${propertyCategory === PropertyCategory.RESALE ? "text-red-500 border-b-2 border-red-500" : "text-gray-700"}`}
            onClick={() =>
              dispatch(setPropertyCategory(PropertyCategory.RESALE))
            }
          >
            Buy
          </button> */}
        </div>

        {/* Search Form */}
        <HomeSearchBar id="desktop-search-bar" />
      </div>
    </>
  );
};

export default MastHeadDesktop;
