import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const useGoogleMapsAPI = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    // More thorough check for the Places library specifically
    console.log("Google Maps useGoogleMapsAPI Loaded:", isLoaded);
    console.log("Google Maps useGoogleMapsAPI Load Error:", loadError);
    const isPlacesLibraryLoaded =
      window.google &&
      window.google.maps &&
      window.google.maps.places &&
      typeof window.google.maps.places.Autocomplete === "function";

    if (!isPlacesLibraryLoaded) {
      // Check if there's already a script tag with this key to avoid duplicates
      const existingScript = document.querySelector(
        `script[src^="https://maps.googleapis.com/maps/api/js?key=${API_KEY}"]`,
      );

      if (existingScript) {
        // If script exists but Places isn't available, remove it so we can reload with correct libraries
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.id = "google-maps-script";

      // Use a more reliable way to detect when Places is actually available
      const checkPlacesInterval = setInterval(() => {
        if (
          window.google &&
          window.google.maps &&
          window.google.maps.places &&
          typeof window.google.maps.places.Autocomplete === "function"
        ) {
          setIsLoaded(true);
          clearInterval(checkPlacesInterval);
        }
      }, 100);

      script.onerror = () => {
        setLoadError(new Error("Failed to load Google Maps API"));
        clearInterval(checkPlacesInterval);
      };

      document.head.appendChild(script);

      return () => {
        clearInterval(checkPlacesInterval);
        const scriptToRemove = document.getElementById("google-maps-script");
        if (scriptToRemove && document.head.contains(scriptToRemove)) {
          document.head.removeChild(scriptToRemove);
        }
      };
    } else {
      setIsLoaded(true);
    }
  }, [isLoaded, loadError]);

  return { isLoaded, loadError };
};

export default useGoogleMapsAPI;
