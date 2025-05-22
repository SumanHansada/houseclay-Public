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
import { useEffect, useState } from "react";

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
    if (map) {
      // Ensure controls are properly initialized
      map.setOptions({
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        gestureHandling: "greedy",
        disableDefaultUI: false,
        ...mapOptions,
      });
    }
  }, [map, mapOptions]);

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
