"use client";

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Pin,
  useApiIsLoaded,
  useMap,
} from "@vis.gl/react-google-maps";
import React from "react";
import { useEffect, useRef, useState } from "react";

interface Location {
  id: string | number;
  position: {
    lat: number;
    lng: number;
  };
  title?: string;
  description?: string;
}

interface GoogleMapsProps {
  mapId?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  mapOptions?: google.maps.MapOptions;
}

const MapContent: React.FC<{
  center: { lat: number; lng: number };
  zoom: number;
  className: string;
  mapId?: string;
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  mapOptions?: google.maps.MapOptions;
}> = ({
  center,
  zoom,
  className,
  mapId,
  selectedLocation,
  setSelectedLocation,
  mapOptions,
}) => {
  const isApiLoaded = useApiIsLoaded();
  const [centerLatLng, setCenterLatLng] = useState<google.maps.LatLng | null>(
    null,
  );
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const hasSetInitialCenter = useRef(false);
  const map = useMap();

  // Only set center once on initial load or when coordinates actually change significantly
  useEffect(() => {
    if (
      isApiLoaded &&
      center &&
      typeof center.lat === "number" &&
      typeof center.lng === "number" &&
      !isNaN(center.lat) &&
      !isNaN(center.lng)
    ) {
      const newLatLng = new google.maps.LatLng(center.lat, center.lng);

      // Only update if this is the first time or coordinates changed significantly
      if (
        !hasSetInitialCenter.current ||
        !centerLatLng ||
        Math.abs(centerLatLng.lat() - center.lat) > 0.001 ||
        Math.abs(centerLatLng.lng() - center.lng) > 0.001
      ) {
        setCenterLatLng(newLatLng);
        hasSetInitialCenter.current = true;
      }
    }
  }, [center, isApiLoaded, centerLatLng]);

  useEffect(() => {
    if (map && !isMapInitialized) {
      // Set map options without overriding zoom repeatedly
      map.setOptions({
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
        streetViewControl: true,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
        gestureHandling: "greedy",
        disableDefaultUI: false,
        scrollwheel: true,
        draggable: true,
        ...mapOptions,
      });

      setIsMapInitialized(true);
    }
  }, [map, mapOptions, isMapInitialized]); // Removed zoom from dependencies

  if (!centerLatLng) {
    return <div className={className}>Loading map...</div>;
  }

  return (
    <Map
      mapId={mapId}
      defaultCenter={{ lat: centerLatLng.lat(), lng: centerLatLng.lng() }} // Convert LatLng to LatLngLiteral
      defaultZoom={zoom} // Use defaultZoom instead of zoom
      className={`${className} overflow-hidden`}
    >
      <AdvancedMarker position={centerLatLng}>
        <Pin
          background={"#FF5252"}
          borderColor={"#B71C1C"}
          glyphColor={"#FFFFFF"}
        />
      </AdvancedMarker>
      {selectedLocation && (
        <InfoWindow
          position={
            new google.maps.LatLng(
              selectedLocation.position.lat,
              selectedLocation.position.lng,
            )
          }
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-semibold text-gray-800">
              {selectedLocation.title}
            </h3>
            {selectedLocation.description && (
              <p className="text-gray-600 text-sm mt-1">
                {selectedLocation.description}
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </Map>
  );
};

const GoogleMaps: React.FC<GoogleMapsProps> = ({
  mapId,
  center = { lat: 20.5937, lng: 78.9629 },
  zoom = 10,
  className = "h-96 w-full",
  mapOptions = {},
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      libraries={["places"]}
    >
      <MapContent
        center={center}
        zoom={zoom}
        className={className}
        mapId={mapId}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        mapOptions={mapOptions}
      />
    </APIProvider>
  );
};

export default GoogleMaps;
