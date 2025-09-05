"use client";
import { motion } from "framer-motion";
import Image from "next/image";

import { ConnectsBundle } from "@/interfaces/ConnectsBundle";

interface ConnectsBundleProps {
  bundle: ConnectsBundle;
  selectedBundle: string;
  isMobile?: boolean;
}

export default function ConnectsBundleCard({
  bundle,
  selectedBundle,
  isMobile = false,
}: ConnectsBundleProps) {
  return (
    <motion.div
      className={`relative w-full rounded-xl p-6 ${
        isMobile ? "rounded-lg p-4 border-2 border-gray-200" : "h-[26rem]"
      }`}
      style={{
        backgroundImage: `url('/images/${bundle.background}.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      whileHover={{
        scale: selectedBundle === bundle.id ? (isMobile ? 1.06 : 1.08) : 1.02,
        rotateX: isMobile ? 3 : 5,
        rotateY: isMobile ? 3 : 5,
        backgroundSize: "auto",
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98, rotateY: isMobile ? 45 : 0 }}
      initial={{ rotateX: 0, rotateY: 0, scale: 1 }}
      animate={{
        rotateX: 0,
        rotateY: 0,
        scale: selectedBundle === bundle.id ? (isMobile ? 1.03 : 1.05) : 1,
        zIndex: selectedBundle === bundle.id ? 10 : 1,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {bundle.recommended && (
        <div
          className={`absolute ${isMobile ? "-top-2 left-4" : "-top-3 left-1/2 transform -translate-x-1/2"}`}
        >
          <span
            className={`bg-red-500 text-white rounded-full font-medium ${
              isMobile ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"
            }`}
          >
            Recommended
          </span>
        </div>
      )}

      <div
        className={`w-6 h-6 mb-4 rounded-full border-2 flex items-center justify-center ${
          selectedBundle === bundle.id
            ? `${bundle.borderColor} bg-white`
            : "border-slate-300 bg-slate-300 opacity-75"
        }`}
      >
        {selectedBundle === bundle.id ? (
          <div
            className={`w-3 h-3 rounded-full ${bundle.backgroundColor}`}
          ></div>
        ) : (
          <div className="w-3 h-3 rounded-full bg-white"></div>
        )}
      </div>

      <h2 className="flex font-bold text-2xl text-white">{bundle.title}</h2>
      <h2 className="flex font-bold text-2xl mb-4 text-white">
        {bundle.subTitle}
      </h2>
      <div className="flex items-center gap-1 rounded-full mb-4">
        <Image src="/icons/coin.svg" alt="coin" width={24} height={24} />
        <span className="flex font-medium text-white text-sm">
          {bundle.connects} Connects
        </span>
      </div>

      <div className="flex mb-2">
        <span className="line-through text-white">
          ₹{bundle.originalPrice.toLocaleString()}/-
        </span>
      </div>
      <div className="flex">
        <span className="text-2xl font-bold text-white mb-4">
          ₹{bundle.discountedPrice.toLocaleString()}/-
        </span>
      </div>

      <div className="flex items-center justify-between mb-8  text-white">
        <span className="text-white font-medium text-xs bg-gray-200 bg-opacity-30 px-2 py-1 rounded-full">
          {bundle.discount}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-white text-xs">Validity:</span>
        <span className="text-white text-base">{bundle.validity}</span>
      </div>
    </motion.div>
  );
}
