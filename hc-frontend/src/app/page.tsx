"use client";
import { X } from "lucide-react";
import Image from "next/image";
import DealSvg from "public/icons/deal.svg";
import FindFlatmatesSvg from "public/icons/find-flatmates.svg";
import FindRoomsSvg from "public/icons/find-rooms.svg";
import ListPropertySvg from "public/icons/list-property.svg";
import SearchSvg from "public/icons/search.svg";
import WeeklyStandoutsSvg from "public/icons/weekly-standouts.svg";
import ZeroPercentSvg from "public/icons/zero-percent.svg";
import { useState } from "react";

import { Dialog, DialogContent, DialogHeader } from "@/components/Dialog";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HomeSearchBar from "@/components/HomeSearchBar";
import Login from "@/components/Login";
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
  const Search = SearchSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const FindFlatmates = FindFlatmatesSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const FindRooms = FindRoomsSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const WeeklyStandouts = WeeklyStandoutsSvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const ListProperty = ListPropertySvg as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  const Deal = DealSvg as React.FC<React.SVGProps<SVGSVGElement>>;
  const ZeroPercent = ZeroPercentSvg as React.FC<React.SVGProps<SVGSVGElement>>;

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
          <div className="absolute inset-0 bg-[url('/images/banner-background.svg')] bg-right bg-cover"></div>
          <div className="absolute h-full flex flex-col justify-center xl:pl-40 lg:pl-14 pl-14 xl:w-2/3 lg:w-4/5 md:w-5/6 w-5/6">
            {/* Headings */}
            <div className="max-w-md mb-8">
              <h1 className="xl:text-6xl lg:text-5xl text-5xl font-bold text-gray-900 mb-2">
                No Middlemen
              </h1>
              <h2 className="xl:text-5xl lg:text-4xl text-4xl text-gray-800">
                Just Connects
              </h2>
            </div>

            {/* Tabs */}
            <div className="max-w-5xl flex justify-start pl-8 mb-4">
              <button
                className={`px-6 py-2 text-lg border-b-2 border-gray-300 ${activeTab === "rent" ? "text-red-500 border-b-2 border-red-500" : "text-gray-700"}`}
                onClick={() => setActiveTab("rent")}
              >
                Rent
              </button>
              <button
                className={`px-6 py-2 text-lg border-b-2 border-gray-300 ${activeTab === "sale" ? "text-red-500 border-b-2 border-red-500" : "text-gray-700"}`}
                onClick={() => setActiveTab("sale")}
              >
                Buy
              </button>
            </div>

            {/* Search Form */}
            <HomeSearchBar />
          </div>
        </section>
        <section className={"min-h-[500px] w-full overflow-hidden md:hidden"}>
          <div className="bg-[url('/images/banner-background-mobile.png')] flex flex-col bg-top bg-cover px-8 pt-8 pb-14 gap-6">
            {/* Tabs and Search */}
            <div>
              {/* Tabs */}
              <div className="flex justify-center">
                <button
                  onClick={() => setActiveTab("rent")}
                  className={`px-8 py-2 border-b-2 border-gray-300 ${activeTab === "rent" ? "text-red-500 border-red-500" : "text-gray-700 "}`}
                >
                  Rent
                </button>
                <button
                  onClick={() => setActiveTab("buy")}
                  className={`px-8 py-2 border-b-2 border-gray-300 ${activeTab === "buy" ? "text-red-500 border-red-500" : "text-gray-700 "}`}
                >
                  Buy
                </button>
              </div>

              {/* Search */}
              <div>
                <div className="flex pl-8 pr-2 py-2 rounded-full bg-white border border-gray-200">
                  <div className="flex-1 justify-center items-center self-center bg-white opacity-50">
                    <input
                      type="text"
                      placeholder="Enter a locality or location..."
                      className="w-full h-full text-gray-500"
                    />
                  </div>
                  {/* Search Button */}
                  <button className=" text-white flex items-center justify-center">
                    <Search width={40} height={40} />
                  </button>
                </div>
              </div>
            </div>
            {/* Tagline */}
            <div className="flex justify-center items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-inter">
                  No Middleman,
                </span>
                <span className="text-xl font-nunito text-red-500 ">
                  Just Connects
                </span>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-4 gap-4">
              <div className="flex-1 flex-col items-center">
                <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-1 justify-center items-center">
                  <div className="rounded-full">
                    <FindFlatmates />
                  </div>
                </div>
                <div className="text-center mt-2">
                  <div className="text-sm font-nunito">Find Flatmates</div>
                </div>
              </div>

              <div className="flex-1 flex-col items-center">
                <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-1 justify-center items-center">
                  <div className="rounded-full">
                    <FindRooms />
                  </div>
                </div>
                <div className="text-center mt-2">
                  <div className="text-sm font-nunito">Find Rooms</div>
                </div>
              </div>

              <div
                className="flex-1 flex-col items-center"
                onClick={() => openDialog("standouts-dialog")}
              >
                <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-1 justify-center items-center">
                  <div className="rounded-full">
                    <WeeklyStandouts />
                  </div>
                </div>
                <div className="text-center mt-2">
                  <div className="text-sm font-nunito">Weekly Standouts</div>
                </div>
              </div>

              <div className="flex-1 flex-col items-center">
                <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-1 justify-center items-center relative">
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded">
                    FREE
                  </div>
                  <div className="rounded-full">
                    <ListProperty />
                  </div>
                </div>
                <div className="text-center mt-2 flex-1">
                  <div className="text-sm font-nunito">List Your Property</div>
                </div>
              </div>
            </div>

            {/* Banner */}
            <div className="bg-[url('/images/banner-people-mobile.svg')] bg-cover bg-right bg-no-repeat rounded-2xl p-5 relative">
              <div className="w-full">
                <h3 className="font-bold">Introducing connects</h3>
                <p className="text-xs text-gray-600 mt-2">
                  The new way to find your house
                </p>

                <div className="flex items-center mt-2 gap-2">
                  <ZeroPercent />
                  <span className="text-sm">ZERO brokerage</span>
                </div>

                <div className="flex items-center mt-2 gap-3">
                  <Deal />
                  <span className="text-sm">Direct Deals</span>
                </div>
              </div>
              <button className="absolute bg-red-500 right-6 -bottom-6 text-white font-nunito px-4 py-2 rounded-2xl border-4 border-red-100 font-bold">
                Know More
              </button>
            </div>
          </div>
        </section>
        <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
          <div className="flex flex-col items-center justify-between gap-10 xl:px-28 lg:px-14 md:px-14 px-8 py-20">
            <div className="flex flex-col items-center justify-center gap-4">
              <h1 className="text-4xl font-bold text-center">Why Choose Us?</h1>
              <div className="text-center text-gray-600">
                Discover the advantages of using our platform to find your
                perfect property.
              </div>
            </div>
            <div className="flex flex-wrap xl:gap-12 lg:gap-6 gap-6 justify-between">
              <div className="flex flex-1 flex-col bg-white rounded-3xl  border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3 py-6 justify-between items-center gap-4">
                <Image
                  src="/icons/direct-owner-access.svg"
                  alt="Direct Owner Accesss"
                  width={150}
                  height={150}
                />
                <h1 className="font-bold text-center">Direct Owner Access</h1>
                <p className="text-center">
                  Skip the brokers — connect straight to property owners with
                  ease.
                </p>
              </div>
              <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3  py-6 justify-between items-center gap-4">
                <Image
                  src="/icons/pay-as-you-go.svg"
                  alt="Pay-As-You-Go"
                  width={150}
                  height={150}
                />
                <h1 className="font-bold text-center">Pay-As-You-Go</h1>
                <p className="text-center">
                  Buy connects only when you need them. No subscriptions, no
                  hidden fees.
                </p>
              </div>
              <div className="flex flex-1 flex-col bg-white rounded-3xl border border-gray-200 shadow-lg xl:px-12 lg:px-6 px-3  py-6 justify-between items-center gap-4">
                <Image
                  src="/icons/exclusive-listings.svg"
                  alt="Exclusive Listings"
                  width={150}
                  height={150}
                />
                <h1 className="font-bold text-center">Exclusive Listings</h1>
                <p className="text-center">
                  Access properties you won’t find anywhere else, only on
                  HouseClay.
                </p>
              </div>
            </div>
          </div>
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
