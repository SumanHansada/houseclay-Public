"use client";
import { useParams } from "next/navigation";

export default function PropertyDetailsOverviewPage() {
  const { propertyID, type } = useParams();
  return (
    <h1 className="h-full">
      Property Details for ID - {propertyID}, Type - {type}
    </h1>
  );
}
