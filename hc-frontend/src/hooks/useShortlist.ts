import { useCallback } from "react";
import toast from "react-hot-toast";
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

export const useShortlist = () => {
  const dispatch = useDispatch();
  const { openDialog } = useDialog();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const shortlistedProperties = useSelector(
    (state: RootState) => state.shortlist.shortlistedProperties,
  );

  const [shortlistProperty] = useShortlistPropertyMutation();
  const [removeShortlistedProperty] = useRemoveShortlistedPropertyMutation();
  const [getShortlistedProperties] = useLazyGetShortlistedPropertiesQuery();

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
      if (!isAuthenticated) {
        openDialog("login-dialog");
        return false;
      }

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
