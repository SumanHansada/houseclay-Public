import { useCallback } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { PropertyCardWithImages } from "@/interfaces/User";
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

export const useShortlist = () => {
  const dispatch = useDispatch();
  const { openDialog } = useDialog();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { shortlistedProperties } = useSelector(
    (state: RootState) => state.shortlist,
  );

  const [shortlistProperty] = useShortlistPropertyMutation();
  const [removeShortlistedProperty] = useRemoveShortlistedPropertyMutation();
  const [getShortlistedProperties] = useLazyGetShortlistedPropertiesQuery();

  // Get shortlisted properties from API when logged in
  const fetchShortlistedProperties = useCallback(async () => {
    if (!isAuthenticated) {
      return [];
    }
    try {
      const result = await getShortlistedProperties().unwrap();
      const items = result.shortlistedProperties ?? [];
      dispatch(setShortlistedProperties(items));
      return items;
    } catch (error) {
      console.error("Error fetching shortlisted properties:", error);
      return [];
    }
  }, [isAuthenticated, getShortlistedProperties, dispatch]);

  // Toggle shortlist status for a property
  const toggleShortlist = useCallback(
    async (property: PropertyCardWithImages) => {
      if (!isAuthenticated) {
        openDialog("login-dialog");
        return false;
      }

      try {
        const propertyId = property.propertyID;
        const isCurrentlyShortlisted = shortlistedProperties.some(
          (prop) => prop.propertyID === propertyId,
        );
        if (isCurrentlyShortlisted) {
          await removeShortlistedProperty({ propertyId }).unwrap();
          dispatch(removeFromShortlist(propertyId));
          toast.success("Removed from your Shortlist");
        } else {
          await shortlistProperty({ propertyId }).unwrap();
          dispatch(addToShortlist(property));
          toast.success("Added to your Shortlist");
        }
        return !isCurrentlyShortlisted;
      } catch (error) {
        toast.error("Failed to update Shortlist");
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
