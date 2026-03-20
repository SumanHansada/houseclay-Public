"use client";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useApiIsLoaded,
  useMap,
} from "@vis.gl/react-google-maps";
import { Fullscreen, Minus, Navigation, Plus } from "lucide-react";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import SvgIcon from "./SvgIcon";

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
  const [distance, setDistance] = useState<string | null>(null);
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
        disableDefaultUI: true,
        streetViewControl: true,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
        gestureHandling: "greedy",
        scrollwheel: true,
        draggable: true,
      });

      const zoomContainer = document.createElement("div");
      zoomContainer.style.margin = "12px";
      const zoomRoot = createRoot(zoomContainer);
      zoomRoot.render(
        <div className="flex flex-col overflow-hidden">
          <button
            onClick={() => map.setZoom((map.getZoom() ?? 10) + 1)}
            className="w-10 h-10 bg-white rounded-t-xl flex items-center justify-center border hover:bg-gray-100 transition-colors text-gray-700"
            aria-label="Zoom in"
          >
            <Plus size={18} />
          </button>
          <div className="h-px bg-gray-200" />
          <button
            onClick={() => map.setZoom((map.getZoom() ?? 10) - 1)}
            className="w-10 h-10 bg-white rounded-b-xl flex items-center justify-center border hover:bg-gray-100 transition-colors text-gray-700"
            aria-label="Zoom out"
          >
            <Minus size={18} />
          </button>
        </div>,
      );
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        zoomContainer,
      );

      const fullscreenContainer = document.createElement("div");
      fullscreenContainer.style.margin = "12px";
      const fullscreenRoot = createRoot(fullscreenContainer);
      fullscreenRoot.render(
        <button
          onClick={() => {
            const mapDiv = map.getDiv();
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              mapDiv.requestFullscreen();
            }
          }}
          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200 hover:bg-gray-100 transition-colors text-gray-700"
          aria-label="Toggle fullscreen"
        >
          <Fullscreen size={18} />
        </button>,
      );
      map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
        fullscreenContainer,
      );

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
            // Extract distance from the route
            if (firstLeg.distance) {
              setDistance(firstLeg.distance.text);
            }
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
      setDistance(null);

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
    <div className="relative w-full h-full">
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
          <div
            className="flex flex-col items-center cursor-pointer"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
          >
            <div className="relative">
              <svg width="36" height="46" viewBox="0 0 36 46" fill="none">
                {" "}
                <path
                  d="M18 2 C9 2 2 9 2 18 C2 27 9 36 14 41 C15.5 42.5 16.8 43 18 43 C19.2 43 20.5 42.5 22 41 C27 36 34 27 34 18 C34 9 27 2 18 2Z"
                  fill="white"
                />{" "}
                <circle cx="18" cy="18" r="13" fill="#ef4444" />{" "}
              </svg>
              <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-8 h-6 flex items-center justify-center text-white pointer-events-none">
                <SvgIcon iconSize="small" name="houseclay-home" size={16} />
              </div>
            </div>
          </div>
        </AdvancedMarker>

        {/* User's current location marker (only show when directions are active) */}
        {showDirections && originLatLng && (
          <AdvancedMarker position={originLatLng}>
            <div
              className="flex flex-col items-center cursor-pointer"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
            >
              <div className="relative">
                <svg width="36" height="46" viewBox="0 0 36 46" fill="none">
                  {" "}
                  <path
                    d="M18 2 C9 2 2 9 2 18 C2 27 9 36 14 41 C15.5 42.5 16.8 43 18 43 C19.2 43 20.5 42.5 22 41 C27 36 34 27 34 18 C34 9 27 2 18 2Z"
                    fill="white"
                  />{" "}
                  <circle cx="18" cy="18" r="13" fill="#3b82f6" />{" "}
                </svg>
                <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-8 h-7 flex items-center justify-center text-white pointer-events-none">
                  <Navigation className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </AdvancedMarker>
        )}
      </Map>
      {/* Distance overlay */}
      {showDirections && distance && (
        <div className="absolute bottom-5 left-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Distance:</span>
            <span className="text-sm font-semibold text-gray-900">
              {distance}
            </span>
          </div>
        </div>
      )}
    </div>
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
