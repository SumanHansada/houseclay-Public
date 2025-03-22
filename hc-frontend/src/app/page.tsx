"use client";
import Image from "next/image";
import { useState } from "react";

import Carousel2D from "@/components/Carousel2D";
import { Dialog, DialogContent } from "@/components/Dialog";
import Dropdown from "@/components/Dropdown";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Login from "@/components/Login";
import Neighborhoods, { Neighborhood } from "@/components/Neighborhoods";
import Properties, { Property } from "@/components/Properties";
import PropertyOwners from "@/components/PropertyOwners";
import Testimonials, { Testimonial } from "@/components/Testimonials";
import { useDialog } from "@/providers/DialogContextProvider";

export default function Home() {
  const { openDialog, isOpen } = useDialog();
  const [activeTab, setActiveTab] = useState("rent");

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
      <main className="mx-auto my-0">
        <section className="relative xl:h-[600px] lg:h-[500px] h-[500px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/banner-background.png')] bg-center bg-cover"></div>
          <div className="absolute inset-0 bg-[url('/images/banner-people.png')] bg-right bg-no-repeat xl:right-40 lg:right-14 right-14"></div>
          <div className="absolute h-full flex flex-col justify-center xl:pl-40 lg:pl-14 pl-14 xl:w-2/3 lg:w-4/5 w-4/5">
            {/* Headings */}
            <div className="max-w-md mb-8">
              <h1 className="text-6xl font-bold text-gray-900 mb-2">
                No Middlemen
              </h1>
              <h2 className="text-5xl text-gray-800">Just Connects</h2>
            </div>

            {/* Tabs */}
            <div className="max-w-4xl">
              <div className="flex ml-8 border-b border-gray-300 mb-4 max-w-xs">
                <button
                  className={`px-6 py-2  ${activeTab === "rent" ? "text-red-500 border-b-2 border-red-500" : "text-gray-600"}`}
                  onClick={() => setActiveTab("rent")}
                >
                  Rent
                </button>
                <button
                  className={`px-6 py-2  ${activeTab === "sale" ? "text-red-500 border-b-2 border-red-500" : "text-gray-600"}`}
                  onClick={() => setActiveTab("sale")}
                >
                  Buy
                </button>
              </div>
            </div>

            {/* Search Form */}
            <div className="flex pl-8 pr-2 rounded-full bg-white shadow-lg overflow-hidden justify-between items-center">
              {/* City */}
              <div className="flex-1 p-3 border-r border-gray-200">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  City
                </div>
                <div className="text-gray-500 text-sm flex items-center">
                  <Dropdown
                    options={[
                      { id: 1, label: "Featured" },
                      { id: 2, label: "Posted (Latest First)" },
                      { id: 3, label: "Posted (Older First)" },
                      { id: 4, label: "Availability (Early First)" },
                      { id: 5, label: "Availability (Late First)" },
                      { id: 6, label: "Price (Lower First)" },
                      { id: 7, label: "Price (Higher First)" },
                    ]}
                    defaultSelected={{ id: 1, label: "Featured" }}
                    onChange={(option) => console.log(option)}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="flex-1 p-3 border-r border-gray-200">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Location
                </div>
                <input
                  type="text"
                  placeholder="Type localities..."
                  className="text-gray-500 text-sm outline-none w-full"
                />
              </div>

              {/* Property Type */}
              <div className="flex-1 p-3 border-r border-gray-200">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Property Type
                </div>
                <div className="text-gray-500 text-sm flex items-center">
                  House
                </div>
              </div>

              {/* Beds */}
              <div className="flex-1 p-3">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Beds
                </div>
                <div className="text-gray-500 text-sm flex items-center">
                  2 BHK
                </div>
              </div>

              {/* Search Button */}
              <div className="">
                <button className=" text-white flex items-center justify-center">
                  <Image
                    src="/icons/search.svg"
                    alt="Search"
                    width={60}
                    height={60}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
          <div className="flex flex-col items-center justify-between gap-10 xl:px-40 lg:px-14 px-14 py-20">
            <div className="flex flex-col items-center justify-center gap-4">
              <h1 className="text-4xl font-bold text-center">Why Choose Us?</h1>
              <div className="text-center text-gray-600 font-thin">
                Discover the advantages of using our platform to find your
                perfect property.
              </div>
            </div>
            <div className="flex gap-6 justify-between">
              <div className="flex flex-1 flex-col bg-white rounded-3xl shadow-lg px-12 py-6 justify-between items-center gap-6">
                <Image
                  src="/icons/direct-owner-connections.svg"
                  alt="Direct Owner Connections"
                  width={150}
                  height={150}
                  layout="responsive"
                />
                <h1 className="font-bold text-center">
                  Direct Owner Connections
                </h1>
              </div>
              <div className="flex flex-1 flex-col bg-white rounded-3xl shadow-lg px-12 py-6  justify-between items-center gap-6">
                <Image
                  src="/icons/use-connects.svg"
                  alt="Use Connects"
                  width={150}
                  height={150}
                  layout="responsive"
                />
                <h1 className="font-bold text-center">Use Connects</h1>
              </div>
              <div className="flex flex-1 flex-col bg-white rounded-3xl shadow-lg px-12 py-6  justify-between items-center gap-6">
                <Image
                  src="/icons/pay-as-you-go.svg"
                  alt="Pay as you go"
                  width={150}
                  height={150}
                  layout="responsive"
                />
                <h1 className="font-bold text-center">Pay as you go</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="min-h-[500px] w-full overflow-hidden">
          {/* Header Section */}
          <div className="bg-[url('/images/banner-background.png')] bg-center bg-cover flex-col items-center py-20 xl:px-40 lg:px-14 px-14">
            <div className="flex items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Standouts of the Day
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex w-full justify-between">
              <div className="max-w-4xl mb-4 border-b border-gray-300">
                <button
                  className={`px-6 py-2 font-medium ${
                    activeTab === "rent"
                      ? "text-red-500 border-b-2 border-red-500"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("rent")}
                >
                  For Rent
                </button>
                <button
                  className={`px-6 py-2 font-medium ${
                    activeTab === "sale"
                      ? "text-red-500 border-b-2 border-red-500"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("sale")}
                >
                  For Sale
                </button>
              </div>
              {/* View All Button */}
              <div className="flex mb-4">
                <button className="border border-red-500 text-red-500 px-4 py-2 rounded-md">
                  View All Standouts
                </button>
              </div>
            </div>

            {/* Property Grid */}
            <Carousel2D slideWidth={370} gap={24}>
              {properties.map((property) => (
                <Properties
                  key={property.id}
                  property={property}
                  badgeType={property.type}
                />
              ))}
            </Carousel2D>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
          </div>
        </section>
        <section className="min-h-[500px] w-full overflow-hidden">
          <Neighborhoods
            listingType={activeTab}
            neighborhoods={sampleNeighborhoods}
          />
          ;
        </section>
        <section className="min-h-[500px] w-full overflow-hidden">
          <Testimonials testimonials={testimonials} />
        </section>
        <section className="min-h-[500px] w-full overflow-hidden">
          <PropertyOwners />
        </section>

        {isOpen("login-dialog") && (
          <Dialog
            id="login-dialog"
            direction="center"
            overlayClose={true}
            borderRadius="all"
          >
            <DialogContent>
              <Login />
            </DialogContent>
          </Dialog>
        )}
      </main>
      <Footer />
    </>
  );
}
