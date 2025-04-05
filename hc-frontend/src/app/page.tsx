"use client";
import { X } from "lucide-react";
import { useState } from "react";

import Advantages from "@/components/Advantages";
import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Login from "@/components/Login";
import MastHeadDesktop from "@/components/MastheadDesktop";
import MastHeadMobile from "@/components/MastheadMobile";
import Neighborhoods, { Neighborhood } from "@/components/Neighborhoods";
import { Property } from "@/components/Properties";
import PropertyOwners from "@/components/PropertyOwners";
import Standouts from "@/components/Standouts";
import StickyNavbar from "@/components/StickyNavbar";
import Testimonials, { Testimonial } from "@/components/Testimonials";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { useDialog } from "@/providers/DialogContextProvider";

export default function Home() {
  const { openDialog, isDialogOpen, closeDialog } = useDialog();
  const [activeTab, setActiveTab] = useState("rent");
  const { isMobile } = useDeviceContext();

  const properties: Property[] = [
    {
      id: 1,
      complex: "Sobha Royal Pavilion",
      beds: 3,
      baths: 3,
      price: "2.3",
      area: "1,790",
      location: "Nagavarapalya, 15th cross, Landmark - Life in...",
      images: [
        "/photos/House1.avif",
        "/photos/House2.avif",
        "/photos/House3.avif",
        "/photos/House4.avif",
      ],
      type: "Featured",
    },
    {
      id: 2,
      complex: "Prestige Lakeside Habitat",
      beds: 3,
      baths: 2,
      price: "1.7",
      area: "1,360",
      location: "Varthur, Gunjur, Bangalore",
      images: [
        "/photos/House1.avif",
        "/photos/House3.avif",
        "/photos/House2.avif",
        "/photos/House4.avif",
      ],
      type: null,
    },
    {
      id: 3,
      complex: "Sobha Neopolis",
      beds: 2,
      baths: 2,
      price: "1.3",
      area: "1180",
      location: "Gunjur Road, Bangalore",
      images: [
        "/photos/House4.avif",
        "/photos/House1.avif",
        "/photos/House3.avif",
        "/photos/House2.avif",
      ],
      type: "Exclusive",
    },
    {
      id: 4,
      complex: "Durga Petals",
      beds: 2,
      baths: 2,
      price: "2.2",
      area: "1240",
      location: "Doddenakundi, Marathahalli, Bangalore",
      images: [
        "/photos/House4.avif",
        "/photos/House3.avif",
        "/photos/House2.avif",
        "/photos/House1.avif",
      ],
      type: "Exclusive",
    },
  ];

  const sampleNeighborhoods: Neighborhood[] = [
    { name: "Whitefield", image: "/neighbourhood/Whitefield.jpeg" },
    { name: "Koramangala", image: "/neighbourhood/Koramangala.jpeg" },
    { name: "Indiranagar", image: "/neighbourhood/Indiranagar.jpeg" },
    { name: "HSR Layout", image: "/neighbourhood/HSR.jpeg" },
    { name: "Jayanagar", image: "/neighbourhood/Jayanagar.jpeg" },
    { name: "Hebbal", image: "/neighbourhood/Hebbal.jpeg" },
    { name: "Sarjapur Road", image: "/neighbourhood/Sarjapur Road.jpeg" },
    { name: "Banashankari", image: "/neighbourhood/Banashankari.jpeg" },
  ];

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Samir T.",
      initial: "S",
      avatar: "/people/daniel.png",
      rating: 5,
      content:
        "Finding the perfect home felt effortless with HouseClay. The team was incredibly supportive, guiding me through every step and providing all the resources I needed.",
    },
    {
      id: 2,
      name: "Rajesh M.",
      initial: "R",
      avatar: "/people/garry.png",
      rating: 5,
      content:
        "The extensive listings, along with accurate property details and legal assistance, made this a smooth, stress-free journey.",
    },
    {
      id: 3,
      name: "Aditya C.",
      initial: "A",
      avatar: "/people/tommy.png",
      rating: 5,
      content:
        "The verified properties and transparent details made all the difference. Their commitment to quality and customer support reassured me, and I'm thrilled with my purchase.",
    },
    {
      id: 4,
      name: "Priya K.",
      initial: "P",
      avatar: "/people/garry.png",
      rating: 5,
      content:
        "As a first-time buyer, I was nervous about the process. The team at HouseClay made everything so simple and straightforward. Couldn't be happier!",
    },
    {
      id: 5,
      name: "Vikram S.",
      initial: "V",
      avatar: "/people/tommy.png",
      rating: 5,
      content:
        "After months of searching elsewhere, I found my dream apartment within two weeks of using this platform. The filters and neighborhood insights were game-changers.",
    },
  ];

  const onLogin = () => {
    openDialog("login-dialog");
  };

  return (
    <>
      <Header onLogin={onLogin} />
      <main className="mx-auto my-0  min-h-screen flex-1 flex flex-wrap items-center justify-center">
        <section className="relative xl:h-[600px] lg:h-[500px] h-[500px] w-full overflow-hidden max-md:hidden">
          <MastHeadDesktop activeTab={activeTab} setActiveTab={setActiveTab} />
        </section>
        <section className={"min-h-[500px] w-full overflow-hidden md:hidden"}>
          <MastHeadMobile activeTab={activeTab} setActiveTab={setActiveTab} />
        </section>
        <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
          <Advantages />
        </section>

        <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
          <Standouts
            listingType={activeTab}
            properties={properties}
            setActiveTab={setActiveTab}
          />
        </section>
        <section className="min-h-[500px] w-full overflow-hidden">
          <Neighborhoods
            listingType={activeTab}
            neighborhoods={sampleNeighborhoods}
          />
        </section>
        <section className="min-h-[500px] w-full overflow-hidden">
          <Testimonials testimonials={testimonials} />
        </section>
        <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
          <PropertyOwners />
        </section>

        {isDialogOpen("login-dialog") && (
          <Dialog
            id="login-dialog"
            type={isMobile ? "fullscreen" : "card"}
            onClose={() => closeDialog("login-dialog")}
          >
            {
              <DialogHeader>
                <div
                  className={`${isMobile ? "py-2 px-8" : ""}  flex flex-col justify-between items-center w-full`}
                >
                  {isMobile && (
                    <h1 className="text-xl mt-1 mb-2 text-black">
                      Log In to Your Account
                    </h1>
                  )}
                  <button className="absolute top-4 right-4 border border-gray-200 rounded-full md:border-none">
                    <X onClick={() => closeDialog("login-dialog")} size={25} />
                  </button>
                </div>
              </DialogHeader>
            }
            <DialogContent>
              <Login />
            </DialogContent>
          </Dialog>
        )}
        {isDialogOpen("standouts-dialog") && (
          <Dialog
            id="standouts-dialog"
            type="bottom-sheet"
            onClose={() => closeDialog("standouts-dialog")}
            height={80}
          >
            {isMobile && (
              <DialogHeader>
                <div className="py-2 px-8 flex flex-col justify-between items-center w-full">
                  <h1 className="text-xl mt-1 mb-2 text-black">Standouts</h1>
                </div>
                <button className="absolute top-4 right-4 border border-gray-200 rounded-full">
                  <X
                    onClick={() => closeDialog("standouts-dialog")}
                    size={25}
                  />
                </button>
              </DialogHeader>
            )}
            <DialogContent>
              <Standouts
                listingType={activeTab}
                properties={properties}
                setActiveTab={setActiveTab}
              />
            </DialogContent>
          </Dialog>
        )}
      </main>
      <Footer />
      {isMobile && <StickyNavbar />}
    </>
  );
}
