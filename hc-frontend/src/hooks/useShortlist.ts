import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
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
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const shortlistedProperties = useSelector(
    (state: RootState) => state.shortlist.shortlistedProperties,
  );
  const hasSyncedRef = useRef(false);

  const [shortlistProperty] = useShortlistPropertyMutation();
  const [removeShortlistedProperty] = useRemoveShortlistedPropertyMutation();
  const [getShortlistedProperties] = useLazyGetShortlistedPropertiesQuery();

  // Sync Redux state with API when user logs in
  useEffect(() => {
    if (
      isAuthenticated &&
      shortlistedProperties.length > 0 &&
      !hasSyncedRef.current
    ) {
      // Sync local shortlisted properties to API
      const syncToAPI = async () => {
        try {
          for (const propertyId of shortlistedProperties) {
            await shortlistProperty({ propertyId }).unwrap();
          }

          // Fetch updated shortlist from API after successful sync
          const result = await getShortlistedProperties().unwrap();
          const propertyIds = result.shortlistedProperties.map(
            (p) => p.propertyId,
          );
          dispatch(setShortlistedProperties(propertyIds));

          toast.success(
            `${shortlistedProperties.length} shortlisted ${shortlistedProperties.length === 1 ? "property" : "properties"} synced successfully`,
          );
          hasSyncedRef.current = true;
        } catch (error) {
          console.error("Error syncing shortlisted properties to API:", error);
          toast.error("Failed to sync shortlisted properties");
        }
      };
      syncToAPI();
    }
  }, [
    isAuthenticated,
    shortlistedProperties,
    shortlistProperty,
    dispatch,
    getShortlistedProperties,
  ]);

  // Get shortlisted properties from API when logged in
  const fetchShortlistedProperties = useCallback(async () => {
    if (isAuthenticated) {
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
  }, [
    isAuthenticated,
    getShortlistedProperties,
    dispatch,
    shortlistedProperties,
  ]);

  // Toggle shortlist status for a property
  const toggleShortlist = useCallback(
    async (propertyId: string) => {
      if (isAuthenticated) {
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
          toast.error("Login to Shortlist Properties");
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
      isAuthenticated,
      shortlistedProperties,
      removeShortlistedProperty,
      shortlistProperty,
      dispatch,
    ],
  );

  // Check if a property is shortlisted
  const isShortlisted = useCallback(
    (propertyId: string): boolean => {
      return shortlistedProperties.includes(propertyId);
    },
    [shortlistedProperties],
  );

  return {
    toggleShortlist,
    isShortlisted,
    fetchShortlistedProperties,
    isAuthenticated,
  };
};
