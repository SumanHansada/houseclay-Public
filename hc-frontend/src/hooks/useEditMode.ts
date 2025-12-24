"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UseEditModeOptions {
  /**
   * If true, resets edit mode to false when pathname changes.
   * Default: false
   */
  resetOnPathnameChange?: boolean;
  /**
   * Initial edit mode state.
   * Default: false
   */
  initialValue?: boolean;
}

// Simple shared state for current route's edit mode
// This allows layout and page components to share state without context
let currentEditMode = false;
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

/**
 * Generic hook for managing edit mode state.
 * Can be used independently without context.
 * Automatically shares state across all instances on the same route.
 *
 * @example
 * // Basic usage
 * const { editMode, setEditMode } = useEditMode();
 *
 * @example
 * // With pathname reset (automatically resets when route changes)
 * const { editMode, setEditMode } = useEditMode({
 *   resetOnPathnameChange: true
 * });
 */
export function useEditMode(options?: UseEditModeOptions) {
  const { resetOnPathnameChange = false, initialValue = false } = options || {};
  const pathname = usePathname();
  const [editMode, setLocalEditMode] = useState(
    currentEditMode || initialValue,
  );

  // Subscribe to shared state changes
  useEffect(() => {
    const listener = () => {
      setLocalEditMode(currentEditMode);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Sync local state with shared state on mount
  useEffect(() => {
    setLocalEditMode(currentEditMode);
  }, []);

  // Set state function that updates both local and shared state
  const setEditMode = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const newValue =
        typeof value === "function" ? value(currentEditMode) : value;
      currentEditMode = newValue;
      notifyListeners();
    },
    [],
  );

  // Reset edit mode when pathname changes (if enabled)
  useEffect(() => {
    if (resetOnPathnameChange) {
      currentEditMode = false;
      notifyListeners();
    }
  }, [pathname, resetOnPathnameChange]);

  return {
    editMode,
    setEditMode,
    /**
     * Toggle edit mode
     */
    toggleEditMode: useCallback(() => {
      setEditMode((prev) => !prev);
    }, [setEditMode]),
    /**
     * Enter edit mode
     */
    enterEditMode: useCallback(() => {
      setEditMode(true);
    }, [setEditMode]),
    /**
     * Exit edit mode
     */
    exitEditMode: useCallback(() => {
      setEditMode(false);
    }, [setEditMode]),
  };
}
