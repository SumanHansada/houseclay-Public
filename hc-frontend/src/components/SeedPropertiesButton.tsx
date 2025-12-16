"use client";

import { useState } from "react";
import { Button } from "@/base-components";
import { usePropertyAddMutation } from "@/store/apiSlice";
import toast from "react-hot-toast";
import { PropertyCategory } from "@/common/enums";
import { FlatmateForm } from "@/interfaces/FlatmateForm";

// 1. The static base payload (based on your JSON)
const BASE_PAYLOAD: Omit<FlatmateForm, "propertyID" | "description"> = {
  propertyCategory: PropertyCategory.FLATMATE,
  propertyType: "apartment",
  builtUpArea: 1580,
  facing: "south-east",
  bhkType: "3-bhk",
  floor: 4,
  totalFloors: 5,
  city: "Bengaluru",
  locationOrSocietyName: "Krishvi Gavakshi Apartment",
  landmark:
    "WMPW+5VW, Gear School Rd, Kaverappa Layout, Kadubeesanahalli, Bengaluru, Karnataka 560103, India",
  latitude: 12.935488999999999,
  longitude: 77.697193,
  rent: 30000,
  maintenanceCharges: 5000,
  depositCharges: 140000,
  availableFrom: "2026-01-14T18:30:00.000Z",
  roomType: "single",
  furnishing: "semi-furnished",
  waterSupply: "borewell-tanker",
  powerBackup: "partial",
  parking: "both",
  nonVegAllowed: true,
  amenities: [
    "Outdoor Dining Area",
    "Fire Extinguisher",
    "Smoke Alarm",
    "Clubhouse",
    "24/7 Power",
  ],
  tenantType: "female",
  bathroomType: "attached",
  balconyType: "shared",
  smokingPreference: true,
  drinkingPreference: true,
  images: [], // Empty as requested
  coverImage: undefined, // Empty as requested
  whoWillShowProperty: "owner",
  secondaryPhoneNumber: "919999999999",
};

export const SeedPropertiesButton = () => {
  const [addProperty] = usePropertyAddMutation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSeed = async () => {
    if (!confirm("Are you sure you want to seed 48 test properties?")) return;

    setLoading(true);
    setProgress(0);

    try {
      // Loop 48 times
      for (let i = 1; i <= 48; i++) {
        // Create a unique simple ID and a slightly unique description
        const payload = {
          ...BASE_PAYLOAD,
          propertyID: i.toString() as string,
          description: `Seeded Test Property #${i}`,
        };

        // We use .unwrap() to ensure we catch errors correctly
        await addProperty(payload).unwrap();

        // Update progress UI
        setProgress(i);
      }
      toast.success("Successfully seeded 48 properties!");
    } catch (error) {
      console.error("Seeding failed:", error);
      toast.error("Seeding failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSeed}
      disabled={loading}
      variant="outline"
      className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
    >
      {loading ? `Seeding... ${progress}/48` : "⚡ Seed 48 Properties"}
    </Button>
  );
};
