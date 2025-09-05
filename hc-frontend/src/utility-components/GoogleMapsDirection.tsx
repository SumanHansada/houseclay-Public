"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  useApiIsLoaded,
  useMap,
} from "@vis.gl/react-google-maps";
import { House } from "lucide-react";
import { Navigation } from "lucide-react";
import React from "react";
import { useEffect, useRef, useState } from "react";

interface GoogleMapsDirectionProps {
  mapId?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  origin: string; // User's current location (address string)
  destination: { lat: number; lng: number }; // Property location (coordinates)
  showDirections: boolean;
}

const GoogleMapsDirectionContent: React.FC<{
  center: { lat: number; lng: number };
  zoom: number;
  className: string;
  mapId?: string;
  origin: string; // User's current location (address string)
  destination: { lat: number; lng: number }; // Property location (coordinates)
  showDirections: boolean;
}> = ({
  center,
  zoom,
  className,
  mapId,
  origin,
  destination,
  showDirections,
}) => {
  const isApiLoaded = useApiIsLoaded();
  const [centerLatLng, setCenterLatLng] = useState<google.maps.LatLng | null>(
    null,
  );
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [originLatLng, setOriginLatLng] = useState<google.maps.LatLng | null>(
    null,
  );
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const hasSetInitialCenter = useRef(false);
  const originalCenter = useRef<{ lat: number; lng: number } | null>(null);
  const originalZoom = useRef<number>(zoom);
  const map = useMap();

  // Only set center once on initial load or when coordinates change significantly
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

      // Store original center for reset
      if (!originalCenter.current) {
        originalCenter.current = center;
      }

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

  // Initialize map and directions services
  useEffect(() => {
    if (map && isApiLoaded && !isMapInitialized) {
      // Initialize directions service and renderer
      const service = new google.maps.DirectionsService();
      const renderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // We'll add our own markers
        polylineOptions: {
          strokeColor: "#FF5252",
          strokeWeight: 4,
        },
      });

      setDirectionsService(service);
      setDirectionsRenderer(renderer);

      // Set map options
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
      });

      setIsMapInitialized(true);
    }
  }, [map, isApiLoaded, isMapInitialized]);

  // Handle directions logic
  useEffect(() => {
    if (
      showDirections &&
      directionsService &&
      directionsRenderer &&
      origin &&
      map
    ) {
      const request: google.maps.DirectionsRequest = {
        origin: origin, // User's current location (string)
        destination: new google.maps.LatLng(destination.lat, destination.lng), // Property location
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setMap(map);
          directionsRenderer.setDirections(result);

          // Store origin coordinates for marker (user's location)
          const route = result.routes[0];
          if (route && route.legs && route.legs.length > 0) {
            const firstLeg = route.legs[0];
            setOriginLatLng(firstLeg.start_location);
          }

          // Fit bounds to show the entire route with padding
          const bounds = new google.maps.LatLngBounds();
          result.routes[0].legs.forEach((leg) => {
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
          });
          map.fitBounds(bounds, 50);
        }
      });
    }
  }, [
    showDirections,
    origin,
    destination,
    directionsService,
    directionsRenderer,
    map,
  ]);

  // Handle clearing directions and resetting map
  useEffect(() => {
    if (!showDirections && directionsRenderer && map) {
      // Clear directions by removing the renderer from map
      directionsRenderer.setMap(null);
      setOriginLatLng(null);

      // Reset to original center and zoom if we have them
      if (originalCenter.current) {
        map.panTo(
          new google.maps.LatLng(
            originalCenter.current.lat,
            originalCenter.current.lng,
          ),
        );
        map.setZoom(originalZoom.current);
      }
    }
  }, [showDirections, directionsRenderer, map]);

  if (!centerLatLng) {
    return <div className={className}>Loading map...</div>;
  }

  return (
    <Map
      mapId={mapId}
      defaultCenter={{ lat: centerLatLng.lat(), lng: centerLatLng.lng() }} // Convert LatLng to LatLngLiteral
      defaultZoom={zoom}
      className={`${className} overflow-hidden`}
    >
      {/* Property/Destination marker - Always visible (the house icon) */}
      <AdvancedMarker
        position={new google.maps.LatLng(destination.lat, destination.lng)}
      >
        <div className="bg-red-500 p-2 rounded-full shadow-lg border-2 border-white">
          <House className="w-5 h-5 text-white" />
        </div>
      </AdvancedMarker>

      {/* User's current location marker (only show when directions are active) */}
      {showDirections && originLatLng && (
        <AdvancedMarker position={originLatLng}>
          <div className="bg-blue-500 p-2 rounded-full shadow-lg border-2 border-white">
            <Navigation className="w-5 h-5 text-white" />
          </div>
        </AdvancedMarker>
      )}
    </Map>
  );
};

const GoogleMapsDirection: React.FC<GoogleMapsDirectionProps> = ({
  mapId,
  center = { lat: 20.5937, lng: 78.9629 },
  zoom = 10,
  className = "h-96 w-full",
  origin, // User's current location (string)
  destination, // Property location (coordinates)
  showDirections,
}) => {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      libraries={["places"]}
    >
      <GoogleMapsDirectionContent
        center={center}
        zoom={zoom}
        className={className}
        mapId={mapId}
        origin={origin}
        destination={destination}
        showDirections={showDirections}
      />
    </APIProvider>
  );
};

export default GoogleMapsDirection;
