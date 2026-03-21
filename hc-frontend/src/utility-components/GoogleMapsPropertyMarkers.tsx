"use client";

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useApiIsLoaded,
  useMap,
} from "@vis.gl/react-google-maps";
import { Fullscreen, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import Properties from "@/components/Properties";
import { PropertySearch } from "@/interfaces/PropertySearch";

import SvgIcon from "./SvgIcon";

interface GoogleMapsPropertyMarkersProps {
  properties: PropertySearch[];
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
  className?: string;
  mapId?: string;
  onMarkerSelect?: (property: PropertySearch | null) => void;
}

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const DEFAULT_ZOOM = 10;

function isValidCoord(lat: number, lng: number): boolean {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

const MapInner: React.FC<{
  properties: PropertySearch[];
  onMarkerSelect?: (property: PropertySearch | null) => void;
}> = memo(function MapInner({ properties, onMarkerSelect }) {
  const map = useMap();
  const isMapInitialized = useRef(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );

  const isOpen = selectedPropertyId !== null;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) setSelectedPropertyId(null);
    },
    placement: "top",
    middleware: [
      offset(12),
      flip({ fallbackPlacements: ["bottom", "left", "right"] }),
      shift({ padding: 12 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context, { outsidePress: false });
  const role = useRole(context, { role: "dialog" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    dismiss,
    role,
  ]);

  useEffect(() => {
    if (map && !isMapInitialized.current) {
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

      map.controls[google.maps.ControlPosition.RIGHT_TOP].push(zoomContainer);
      map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
        fullscreenContainer,
      );

      isMapInitialized.current = true;
    }
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener("click", () => {
      setSelectedPropertyId(null);
      onMarkerSelect?.(null);
    });
    return () => google.maps.event.removeListener(listener);
  }, [map, onMarkerSelect]);

  useEffect(() => {
    if (!map || properties.length === 0) return;
    const valid = properties.filter((p) =>
      isValidCoord(p.latitude, p.longitude),
    );
    if (valid.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    valid.forEach((p) => {
      bounds.extend(new google.maps.LatLng(p.latitude, p.longitude));
    });
    map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
  }, [map, properties]);

  return (
    <>
      <style>{`
        .gm-style gmp-advanced-marker:focus {
          outline: none !important;
        }
        .gm-style gmp-advanced-marker:focus-visible {
          outline: none !important;
          border-radius: 9999px;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5);
        }
      `}</style>

      {properties.map((p) => {
        if (!isValidCoord(p.latitude, p.longitude)) return null;
        const isSelected = selectedPropertyId === p.propertyID;

        return (
          <AdvancedMarker
            key={p.propertyID}
            position={{ lat: p.latitude, lng: p.longitude }}
            zIndex={isSelected ? 1000 : 1}
            style={
              isSelected && !onMarkerSelect
                ? { overflow: "visible" }
                : undefined
            }
            onClick={() => {
              const nextId =
                selectedPropertyId === p.propertyID ? null : p.propertyID;
              setSelectedPropertyId(nextId);
              onMarkerSelect?.(nextId ? p : null);
            }}
          >
            {isSelected && !onMarkerSelect ? (
              <div className="relative">
                <div
                  ref={refs.setReference}
                  {...getReferenceProps()}
                  className="flex flex-col items-center cursor-pointer"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
                >
                  <svg width="36" height="46" viewBox="0 0 36 46" fill="none">
                    {" "}
                    <path
                      d="M18 2 C9 2 2 9 2 18 C2 27 9 36 14 41 C15.5 42.5 16.8 43 18 43 C19.2 43 20.5 42.5 22 41 C27 36 34 27 34 18 C34 9 27 2 18 2Z"
                      fill="red"
                    />{" "}
                    <circle cx="18" cy="18" r="13" fill="#ef4444" />{" "}
                  </svg>
                  <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-8 h-6 flex items-center justify-center text-white pointer-events-none">
                    <SvgIcon iconSize="small" name="houseclay-home" size={16} />
                  </div>
                </div>
                <FloatingFocusManager
                  context={context}
                  modal={false}
                  initialFocus={-1}
                >
                  <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                    className="w-96 z-50 font-inter text-base leading-normal font-normal"
                  >
                    <Link
                      href={`/property-details/${p.propertyID}`}
                      prefetch={false}
                      className="block"
                    >
                      <Properties
                        property={p}
                        showCarouselDots={false}
                        onClose={() => setSelectedPropertyId(null)}
                      />
                    </Link>
                  </div>
                </FloatingFocusManager>
              </div>
            ) : (
              <div
                className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
              >
                <div className="relative">
                  <svg width="36" height="46" viewBox="0 0 36 46" fill="none">
                    {" "}
                    <path
                      d="M18 2 C9 2 2 9 2 18 C2 27 9 36 14 41 C15.5 42.5 16.8 43 18 43 C19.2 43 20.5 42.5 22 41 C27 36 34 27 34 18 C34 9 27 2 18 2Z"
                      fill={isSelected ? "red" : "white"}
                    />{" "}
                    <circle cx="18" cy="18" r="13" fill="#ef4444" />{" "}
                  </svg>
                  <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-8 h-6 flex items-center justify-center text-white pointer-events-none">
                    <SvgIcon iconSize="small" name="houseclay-home" size={16} />
                  </div>
                </div>
              </div>
            )}
          </AdvancedMarker>
        );
      })}
    </>
  );
});

const MapContent: React.FC<{
  properties: PropertySearch[];
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
  className: string;
  mapId?: string;
  onMarkerSelect?: (property: PropertySearch | null) => void;
}> = memo(function MapContent({
  properties,
  defaultCenter,
  defaultZoom,
  className,
  mapId,
  onMarkerSelect,
}) {
  const isApiLoaded = useApiIsLoaded();
  const initialCenter = useMemo(() => {
    if (
      properties.length > 0 &&
      isValidCoord(properties[0].latitude, properties[0].longitude)
    ) {
      return { lat: properties[0].latitude, lng: properties[0].longitude };
    }
    return defaultCenter;
  }, [defaultCenter, properties]);

  if (!isApiLoaded) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100 rounded-xl border`}
      >
        <span className="text-sm text-gray-500">Loading map...</span>
      </div>
    );
  }

  return (
    <Map
      mapId={mapId}
      defaultCenter={initialCenter}
      defaultZoom={defaultZoom}
      className={`${className} overflow-hidden rounded-xl shadow-md border`}
    >
      <MapInner properties={properties} onMarkerSelect={onMarkerSelect} />
    </Map>
  );
});

const GoogleMapsPropertyMarkers: React.FC<GoogleMapsPropertyMarkersProps> = ({
  properties,
  defaultCenter = DEFAULT_CENTER,
  defaultZoom = DEFAULT_ZOOM,
  className = "h-full w-full min-h-[400px] rounded-xl shadow-md",
  mapId,
  onMarkerSelect,
}) => {
  const validProperties = useMemo(
    () => properties.filter((p) => isValidCoord(p.latitude, p.longitude)),
    [properties],
  );

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  if (!apiKey) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}
      >
        <span className="text-sm text-gray-500">Map unavailable</span>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["places"]}>
      <MapContent
        properties={validProperties}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        className={className}
        mapId={mapId}
        onMarkerSelect={onMarkerSelect}
      />
    </APIProvider>
  );
};

export default GoogleMapsPropertyMarkers;
