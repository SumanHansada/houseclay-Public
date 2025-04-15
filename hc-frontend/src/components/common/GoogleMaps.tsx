import {
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import React from "react";
import { useState } from "react";

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

const GoogleMaps: React.FC<GoogleMapsProps> = ({
  mapId,
  center = { lat: -34.397, lng: 150.644 },
  zoom = 10,
  className = "h-96 w-full",
  mapOptions = {},
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  const { renderingType, colorScheme, ...cleanMapOptions } = mapOptions;
  console.log("Rendering Type", renderingType);
  console.log("Color Scheme", colorScheme);

  return (
    <Map
      mapId={mapId}
      defaultCenter={center}
      defaultZoom={zoom}
      className={className}
      gestureHandling={"greedy"}
      disableDefaultUI={false}
      {...cleanMapOptions}
    >
      <AdvancedMarker
        position={{ lat: center.lat, lng: center.lng }}
        // onClick={() => setSelectedLocation({position: {
        //     lat: center.lat,
        //     lng: center.lng
        // }})}
      >
        <Pin
          background={"#FF5252"}
          borderColor={"#B71C1C"}
          glyphColor={"#FFFFFF"}
        />
      </AdvancedMarker>
      {selectedLocation && (
        <InfoWindow
          position={selectedLocation.position}
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

export default GoogleMaps;
