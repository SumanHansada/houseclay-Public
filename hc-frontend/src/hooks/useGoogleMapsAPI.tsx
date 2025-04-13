// useGoogleMapsAPI.js
import { useEffect, useState } from "react";

const useGoogleMapsAPI = (apiKey: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setIsLoaded(true);
      };

      script.onerror = () => {
        setLoadError(new Error("Failed to load Google Maps API"));
      };

      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    } else {
      setIsLoaded(true);
    }
  }, [apiKey]);

  return { isLoaded, loadError };
};

export default useGoogleMapsAPI;
