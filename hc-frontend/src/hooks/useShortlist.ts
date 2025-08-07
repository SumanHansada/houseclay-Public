import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  useLazyGetShortlistedPropertiesQuery,
  useRemoveShortlistedPropertyMutation,
  useShortlistPropertyMutation,
} from "@/store/apiSlice";
import {
  addToShortlist,
  removeFromShortlist,
  setShortlistedProperties,
} from "@/store/shortlistPropertySlice";
import { RootState } from "@/store/store";

export const useShortlist = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const shortlistedProperties = useSelector(
    (state: RootState) => state.shortlist.shortlistedProperties,
  );
  const isLoggedIn = !!token;

  const [shortlistProperty] = useShortlistPropertyMutation();
  const [removeShortlistedProperty] = useRemoveShortlistedPropertyMutation();
  const [getShortlistedProperties] = useLazyGetShortlistedPropertiesQuery();

  // Sync Redux state with API when user logs in
  useEffect(() => {
    if (isLoggedIn && shortlistedProperties.length > 0) {
      // Sync local shortlisted properties to API
      const syncToAPI = async () => {
        try {
          for (const propertyId of shortlistedProperties) {
            await shortlistProperty({ propertyId }).unwrap();
          }
          // Clear local state after successful sync
          dispatch(setShortlistedProperties([]));
        } catch (error) {
          console.error("Error syncing shortlisted properties to API:", error);
        }
      };
      syncToAPI();
    }
  }, [isLoggedIn, shortlistedProperties, shortlistProperty, dispatch]);

  // Get shortlisted properties from API when logged in
  const fetchShortlistedProperties = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const result = await getShortlistedProperties().unwrap();
        const propertyIds = result.shortlistedProperties.map(
          (p) => p.propertyId,
        );
        dispatch(setShortlistedProperties(propertyIds));
        return propertyIds;
      } catch (error) {
        console.error("Error fetching shortlisted properties:", error);
        return [];
      }
    }
    return shortlistedProperties;
  }, [isLoggedIn, getShortlistedProperties, shortlistedProperties, dispatch]);

  // Toggle shortlist status for a property
  const toggleShortlist = useCallback(
    async (propertyId: string) => {
      if (isLoggedIn) {
        // User is logged in - use API
        try {
          const isCurrentlyShortlisted =
            shortlistedProperties.includes(propertyId);

          if (isCurrentlyShortlisted) {
            await removeShortlistedProperty({ propertyId }).unwrap();
            dispatch(removeFromShortlist(propertyId));
          } else {
            await shortlistProperty({ propertyId }).unwrap();
            dispatch(addToShortlist(propertyId));
          }
          return !isCurrentlyShortlisted;
        } catch (error) {
          console.error("Error toggling shortlist:", error);
          throw error;
        }
      } else {
        // User is not logged in - use Redux state (persisted)
        const isCurrentlyShortlisted =
          shortlistedProperties.includes(propertyId);

        if (isCurrentlyShortlisted) {
          dispatch(removeFromShortlist(propertyId));
        } else {
          dispatch(addToShortlist(propertyId));
        }
        return !isCurrentlyShortlisted;
      }
    },
    [
      isLoggedIn,
      shortlistedProperties,
      shortlistProperty,
      removeShortlistedProperty,
      dispatch,
    ],
  );

  // Check if a property is shortlisted
  const isShortlisted = useCallback(
    async (propertyId: string): Promise<boolean> => {
      if (isLoggedIn) {
        try {
          const shortlistedIds = await fetchShortlistedProperties();
          return shortlistedIds.includes(propertyId);
        } catch (error) {
          console.error("Error checking shortlist status:", error);
          return false;
        }
      } else {
        return shortlistedProperties.includes(propertyId);
      }
    },
    [isLoggedIn, shortlistedProperties, fetchShortlistedProperties],
  );

  return {
    toggleShortlist,
    isShortlisted,
    fetchShortlistedProperties,
    isLoggedIn,
  };
};
