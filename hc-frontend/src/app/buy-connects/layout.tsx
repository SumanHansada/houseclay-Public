// "use client";

// import { ChevronLeft } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { type ReactNode } from "react";

// import { Button } from "@/base-components";
// import { MobileHeader } from "@/layout-components";
// import Footer from "@/layout-components/Footer";

// export default function BuyConnectsLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const router = useRouter();

//   const handleBackClick = () => {
//     router.back();
//   };

//   return (
//     <>
//       <MobileHeader>
//         <MobileHeader.LeftAction>
//           <Button
//             variant="secondary"
//             size="custom"
//             className="rounded-full p-1"
//             onClick={handleBackClick}
//           >
//             <ChevronLeft size={24} />
//           </Button>
//         </MobileHeader.LeftAction>
//         <MobileHeader.Title>Buy Connects</MobileHeader.Title>
//       </MobileHeader>

//       {children}

//       {/* Desktop Footer */}
//       <Footer />
//     </>
//   );
// }
