import React, { useEffect, useRef, useState } from "react";

interface AnimatedPlaceholderProps {
  value: string;
  placeholder?: string;
  animatedPlaceholders?: string[];
  onFocus?: () => void;
  onBlur?: () => void;
}

type OmitAnimatedPlaceholderProps<P> = Omit<P, "placeholder"> & {
  placeholder?: string;
  animatedPlaceholders?: string[];
};

function withAnimatedPlaceholder<P extends AnimatedPlaceholderProps>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<OmitAnimatedPlaceholderProps<P>> {
  return function WithAnimatedPlaceholder(
    props: OmitAnimatedPlaceholderProps<P>,
  ) {
    const {
      value,
      placeholder = "",
      animatedPlaceholders,
      onFocus,
      onBlur,
      ...rest
    } = props;
    const [isFocused, setIsFocused] = useState(false);

    const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

    const placeholderTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const letterTimeoutRefs = useRef<NodeJS.Timeout[]>([]);
    const animationRef = useRef<{
      currentLetters: string[];
      remainingLetters: string[];
      targetText: string;
    } | null>(null);

    // Helper function to get random delay between min and max
    const getRandomDelayBetween = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    // Effect to manage animation lifecycle
    useEffect(() => {
      // Clear any existing animations
      letterTimeoutRefs.current.forEach(clearTimeout);
      letterTimeoutRefs.current = [];
      if (placeholderTimeoutRef.current) {
        clearTimeout(placeholderTimeoutRef.current);
      }

      // Only animate if:
      // 1. animatedPlaceholders is provided and has items
      // 2. Input value is empty
      // 3. Input is not focused
      if (
        animatedPlaceholders &&
        animatedPlaceholders.length > 0 &&
        !value &&
        !isFocused
      ) {
        const placeholderText =
          animatedPlaceholders[currentPlaceholderIndex] ||
          animatedPlaceholders[0];
        const letters = placeholderText.split("");

        // Reset animation state
        setAnimatedPlaceholder("");
        animationRef.current = {
          currentLetters: [],
          remainingLetters: [...letters],
          targetText: placeholderText,
        };

        // Function to animate letters one by one
        const animateLetters = () => {
          if (!animationRef.current) return;

          const { currentLetters, remainingLetters } = animationRef.current;

          if (!remainingLetters.length) {
            // Animation complete, wait then start next placeholder
            placeholderTimeoutRef.current = setTimeout(() => {
              if (
                animatedPlaceholders &&
                animatedPlaceholders.length > 0 &&
                !value &&
                !isFocused
              ) {
                let nextIndex = Math.floor(
                  Math.random() * animatedPlaceholders.length,
                );
                // Avoid repeating the same placeholder
                while (
                  nextIndex === currentPlaceholderIndex &&
                  animatedPlaceholders.length > 1
                ) {
                  nextIndex = Math.floor(
                    Math.random() * animatedPlaceholders.length,
                  );
                }
                setCurrentPlaceholderIndex(nextIndex);
              }
            }, 1000);
            animationRef.current = null;
            return;
          }

          const nextLetter = remainingLetters.shift();
          if (nextLetter) {
            currentLetters.push(nextLetter);

            // Simple state update
            setAnimatedPlaceholder(currentLetters.join(""));

            const delay = getRandomDelayBetween(50, 90);
            const timeoutId = setTimeout(animateLetters, delay);
            letterTimeoutRefs.current.push(timeoutId);
          }
        };

        // Start animation with a small delay to ensure state is ready
        const initialTimeout = setTimeout(animateLetters, 100);
        letterTimeoutRefs.current.push(initialTimeout);
      } else {
        // Stop animation if user types or focuses
        setAnimatedPlaceholder("");
        animationRef.current = null;
      }

      return () => {
        letterTimeoutRefs.current.forEach(clearTimeout);
        letterTimeoutRefs.current = [];
        if (placeholderTimeoutRef.current) {
          clearTimeout(placeholderTimeoutRef.current);
        }
      };
    }, [value, isFocused, animatedPlaceholders, currentPlaceholderIndex]);

    // Determine which placeholder to show
    const displayPlaceholder =
      animatedPlaceholders &&
      animatedPlaceholders.length > 0 &&
      !value &&
      !isFocused
        ? animatedPlaceholder || placeholder
        : placeholder;

    return React.createElement(WrappedComponent, {
      ...(rest as P),
      value,
      placeholder: displayPlaceholder,
      onFocus: () => {
        setIsFocused(true);
        onFocus?.();
      },
      onBlur: () => {
        setIsFocused(false);
        onBlur?.();
      },
    } as P);
  };
}

export default withAnimatedPlaceholder;
