import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useDialog } from "@/providers/DialogContextProvider";
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
import { PropertyCardWithImages } from "@/interfaces/User";

export const useShortlist = () => {
  const dispatch = useDispatch();
  const { openDialog } = useDialog();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const { shortlistedProperties } = useSelector(
    (state: RootState) => state.shortlist,
  );

  const [shortlistProperty] = useShortlistPropertyMutation();
  const [removeShortlistedProperty] = useRemoveShortlistedPropertyMutation();
  const [getShortlistedProperties] = useLazyGetShortlistedPropertiesQuery();

  // Get shortlisted properties from API when logged in
  const fetchShortlistedProperties = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const result = await getShortlistedProperties().unwrap();
        const items = result.shortlistedProperties ?? [];
        dispatch(setShortlistedProperties(items));
        return items;
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
    async (property: PropertyCardWithImages) => {
      if (!isAuthenticated) {
        openDialog("login-dialog");
        return false;
      }

      const propertyId = property.propertyID;
      const isCurrentlyShortlisted = shortlistedProperties.some(
        (prop) => prop.propertyID === propertyId,
      );

      try {
        if (isCurrentlyShortlisted) {
          await removeShortlistedProperty({ propertyId }).unwrap();
          dispatch(removeFromShortlist(propertyId));
        } else {
          await shortlistProperty({ propertyId }).unwrap();
          dispatch(addToShortlist(property));
        }
        return !isCurrentlyShortlisted;
      } catch (error) {
        console.error("Error toggling shortlist:", error);
        throw error;
      }
    },
    [
      isAuthenticated,
      shortlistedProperties,
      removeShortlistedProperty,
      shortlistProperty,
      dispatch,
      openDialog,
    ],
  );

  // Check if a property is shortlisted
  const isShortlisted = useCallback(
    (propertyId: string): boolean => {
      return shortlistedProperties.some(
        (prop) => prop.propertyID === propertyId,
      );
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
