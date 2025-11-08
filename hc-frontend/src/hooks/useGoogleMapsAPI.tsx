import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Define the shape of the hook’s return values
interface UseGoogleMapsPlacesReturn {
  isLoaded: boolean;
  loadError: Error | null;
}

/**
 * Dynamically loads the Google Maps JavaScript API with the Places library.
 * Handles reloading, avoids duplicates, and sets language + region for better results.
 */
export const useGoogleMapsAPI = (): UseGoogleMapsPlacesReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    // Avoid reloading if already loaded or failed
    if (isLoaded || loadError) return;

    // Check if the Places library is already available
    const isPlacesLibraryLoaded =
      typeof window !== "undefined" &&
      !!window.google?.maps?.places &&
      typeof window.google.maps.places.Autocomplete === "function";

    // ✅ If it's already loaded, just mark ready
    if (isPlacesLibraryLoaded) {
      setIsLoaded(true);
      return;
    }

    // ✅ Check if a Google Maps script already exists in DOM
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src^="https://maps.googleapis.com/maps/api/js?key=${API_KEY}"]`,
    );

    // ⚙️ If an existing script is missing the Places library, remove it to reload properly
    if (existingScript && !existingScript.src.includes("libraries=places")) {
      console.warn(
        "Existing Google Maps script found without 'places' — reloading...",
      );
      existingScript.remove();
    }

    // ✅ Define a global callback that Google Maps will call after loading
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).initMapPlaces = () => {
      setIsLoaded(true);
    };

    // ✅ Create a new script element with proper configuration
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.defer = true;
    script.src = [
      `https://maps.googleapis.com/maps/api/js`,
      `?key=${API_KEY}`,
      `&libraries=places`, // Load the Places library
      `&language=en`, // Improves fuzzy text search (consistent results)
      `&region=IN`, // Helps match local results better (e.g., India)
      `&v=weekly`, // Always use latest stable build
      `&callback=initMapPlaces`, // Calls our defined callback
    ].join("");

    // ❌ Handle load errors
    script.onerror = () => {
      setLoadError(new Error("Failed to load Google Maps API"));
      console.error("Google Maps useGoogleMapsPlaces Load Error");
    };

    // ✅ Append script to DOM
    document.head.appendChild(script);

    // 🧹 Cleanup function runs on unmount
    return () => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).initMapPlaces;
      const scriptToRemove = document.getElementById("google-maps-script");
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, [isLoaded, loadError]);

  return { isLoaded, loadError };
};

export default useGoogleMapsAPI;
