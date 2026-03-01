// "use client";
// import { motion } from "framer-motion";

// import { coinIconURL } from "@/common/cdnURLs";
// import { ConnectsBundle } from "@/interfaces/ConnectsBundle";
// import { RemoteSvg } from "@/utility-components";

// interface ConnectsBundleProps {
//   bundle: ConnectsBundle;
//   selectedBundle: string;
//   isMobile?: boolean;
// }

// export default function ConnectsBundleCard({
//   bundle,
//   selectedBundle,
// }: ConnectsBundleProps) {
//   return (
//     <motion.div
//       className={
//         "relative mx-auto w-full rounded-xl p-4 h-[20rem] md:h-[22rem] lg:h-[28rem] xl:h-[24rem] 2xl:h-[24rem]"
//       }
//       style={{
//         backgroundImage: `url('/images/${bundle.background}.webp')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//       whileHover={{
//         scale: selectedBundle === bundle.id ? 1.08 : 1.02,
//         rotateX: 0,
//         rotateY: 0,
//         transition: { duration: 0.3 },
//       }}
//       whileTap={{ scale: 0.98, rotateY: 0 }}
//       initial={{ rotateX: 0, rotateY: 0, scale: 1 }}
//       animate={{
//         rotateX: 0,
//         rotateY: 0,
//         scale: selectedBundle === bundle.id ? 1.05 : 1,
//         zIndex: selectedBundle === bundle.id ? 10 : 1,
//       }}
//       transition={{ duration: 0.3, ease: "easeOut" }}
//     >
//       {bundle.recommended && (
//         <div className={"absolute -top-3 left-1/2 transform -translate-x-1/2"}>
//           <span
//             className={
//               "bg-red-500 text-white rounded-full font-medium px-3 py-1 text-xs md:text-sm"
//             }
//           >
//             Recommended
//           </span>
//         </div>
//       )}

//       <div
//         className={`w-4 h-4 md:w-6 md:h-6 mb-2 md:mb-4 rounded-full border-2 flex items-center justify-center ${
//           selectedBundle === bundle.id
//             ? `${bundle.borderColor} bg-white`
//             : "border-slate-300 bg-slate-300 opacity-75"
//         }`}
//       >
//         {selectedBundle === bundle.id ? (
//           <div
//             className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${bundle.backgroundColor}`}
//           ></div>
//         ) : (
//           <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white"></div>
//         )}
//       </div>

//       <h2 className="flex font-bold text-lg md:text-2xl text-white">
//         {bundle.title}
//       </h2>
//       <h2 className="flex font-bold text-lg md:text-2xl md:mb-4 text-white">
//         {bundle.subTitle}
//       </h2>
//       <div className="flex items-center gap-1 rounded-full mb-2 md:mb-4">
//         <RemoteSvg src={coinIconURL} className="w-6 h-6" />
//         <span className="flex font-medium text-white text-xxs md:text-sm">
//           {bundle.connects} Connects
//         </span>
//       </div>

//       <div className="flex md:mb-2">
//         <span className="line-through text-white text-sm md:text-base">
//           ₹{bundle.originalPrice.toLocaleString()}/-
//         </span>
//       </div>
//       <div className="flex">
//         <span className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4">
//           ₹{bundle.discountedPrice.toLocaleString()}/-
//         </span>
//       </div>

//       {/* <div className="flex items-center justify-between mb-8  text-white">
//         <span className="text-white font-medium text-xxs bg-gray-200 bg-opacity-30 px-2 py-1 rounded-full">
//           {bundle.discount}
//         </span>
//       </div> */}
//       <div className="flex items-center gap-1 max-md:mt-20">
//         <span className="text-white text-xxs">Validity:</span>
//         <span className="text-white text-xs md:text-base">
//           {bundle.validity}
//         </span>
//       </div>
//     </motion.div>
//   );
// }
