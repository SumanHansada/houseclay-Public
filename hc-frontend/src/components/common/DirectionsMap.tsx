import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
  useApiIsLoaded,
  useMap,
} from "@vis.gl/react-google-maps";
import React from "react";
import { useEffect, useState } from "react";

interface DirectionsMapProps {
  mapId?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  origin: { lat: number; lng: number };
  destination: string;
  showDirections: boolean;
}

const DirectionsMapContent: React.FC<{
  center: { lat: number; lng: number };
  zoom: number;
  className: string;
  mapId?: string;
  origin: { lat: number; lng: number };
  destination: string;
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
  const map = useMap();

  useEffect(() => {
    if (
      isApiLoaded &&
      center &&
      typeof center.lat === "number" &&
      typeof center.lng === "number" &&
      !isNaN(center.lat) &&
      !isNaN(center.lng)
    ) {
      setCenterLatLng(new google.maps.LatLng(center.lat, center.lng));
    }
  }, [center, isApiLoaded]);

  useEffect(() => {
    if (map && isApiLoaded) {
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
      renderer.setMap(map);

      // Set map options with explicit zoom control positioning
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
    }
  }, [map, isApiLoaded]);

  // Separate effect for directions logic
  useEffect(() => {
    if (
      showDirections &&
      directionsService &&
      directionsRenderer &&
      destination
    ) {
      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);

          // Fit bounds to show the entire route with padding
          const bounds = new google.maps.LatLngBounds();
          result.routes[0].legs.forEach((leg) => {
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
          });
          map?.fitBounds(bounds, 50);
        }
      });
    }
  }, [
    showDirections,
    destination,
    origin,
    directionsService,
    directionsRenderer,
    map,
  ]);

  // Separate effect for clearing directions and resetting map
  useEffect(() => {
    if (!showDirections && directionsRenderer && map) {
      // Clear directions by removing the renderer from map
      directionsRenderer.setMap(null);

      // Reset to original center and zoom
      map.setCenter(new google.maps.LatLng(center.lat, center.lng));
      map.setZoom(zoom);
    }
  }, [showDirections, directionsRenderer, map, center, zoom]);

  if (!centerLatLng) {
    return <div className={className}>Loading map...</div>;
  }

  return (
    <Map
      mapId={mapId}
      center={centerLatLng}
      zoom={zoom}
      className={`${className} overflow-hidden`}
    >
      {/* Origin marker */}
      <AdvancedMarker position={new google.maps.LatLng(origin.lat, origin.lng)}>
        <Pin
          background={"#FF5252"}
          borderColor={"#B71C1C"}
          glyphColor={"#FFFFFF"}
        />
      </AdvancedMarker>

      {/* Destination marker (only show when directions are active) */}
      {showDirections && directionsRenderer && (
        <AdvancedMarker
          position={new google.maps.LatLng(origin.lat, origin.lng)}
        >
          <Pin
            background={"#4CAF50"}
            borderColor={"#2E7D32"}
            glyphColor={"#FFFFFF"}
          />
        </AdvancedMarker>
      )}
    </Map>
  );
};

const DirectionsMap: React.FC<DirectionsMapProps> = ({
  mapId,
  center = { lat: 20.5937, lng: 78.9629 },
  zoom = 10,
  className = "h-96 w-full",
  origin,
  destination,
  showDirections,
}) => {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      libraries={["places"]}
    >
      <DirectionsMapContent
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

export default DirectionsMap;
