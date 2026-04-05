import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/dialogs/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/base-components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/form-components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utility-components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layout-components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.json",
    "./.storybook/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        // Smaller fonts
        xxs: "0.625rem", // 10px
        xxxs: "0.5rem", // 8px
      },
      spacing: {
        // Safe area variables
        "safe-top": "env(safe-area-inset-top)",
        "safe-right": "env(safe-area-inset-right)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-bottom-2": "calc(env(safe-area-inset-bottom) + 0.5rem)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        nunito: "var(--font-nunito)",
        inter: "var(--font-inter)",
      },
      keyframes: {
        // Fade animations
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "dialog-backdrop-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "dialog-backdrop-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        // Slide animations
        "slide-in-top": {
          "0%": { transform: "translate3d(0, -100%, 0)", opacity: "0" },
          "100%": { transform: "translate3d(0, 0, 0)", opacity: "1" },
        },
        "slide-out-top": {
          "0%": { transform: "translate3d(0, 0, 0)", opacity: "1" },
          "100%": { transform: "translate3d(0, -100%, 0)", opacity: "0" },
        },
        "slide-in-bottom": {
          "0%": { transform: "translate3d(0, 100%, 0)", opacity: "0" },
          "100%": { transform: "translate3d(0, 0, 0)", opacity: "1" },
        },
        "slide-out-bottom": {
          "0%": { transform: "translate3d(0, 0, 0)", opacity: "1" },
          "100%": { transform: "translate3d(0, 100%, 0)", opacity: "0" },
        },
        "slide-in-left": {
          "0%": { transform: "translate3d(-100%, 0, 0)", opacity: "0" },
          "100%": { transform: "translate3d(0, 0, 0)", opacity: "1" },
        },
        "slide-out-left": {
          "0%": { transform: "translate3d(0, 0, 0)", opacity: "1" },
          "100%": { transform: "translate3d(-100%, 0, 0)", opacity: "0" },
        },
        "slide-in-right": {
          "0%": { transform: "translate3d(100%, 0, 0)", opacity: "0" },
          "100%": { transform: "translate3d(0, 0, 0)", opacity: "1" },
        },
        "slide-out-right": {
          "0%": { transform: "translate3d(0, 0, 0)", opacity: "1" },
          "100%": { transform: "translate3d(100%, 0, 0)", opacity: "0" },
        },
        // Zoom — subtle scale + opacity; scale3d for compositing (iOS-like sheets avoid heavy bounce)
        "zoom-in": {
          "0%": { transform: "scale3d(0.92, 0.92, 1)", opacity: "0" },
          "100%": { transform: "scale3d(1, 1, 1)", opacity: "1" },
        },
        "zoom-out": {
          "0%": { transform: "scale3d(1, 1, 1)", opacity: "1" },
          "100%": { transform: "scale3d(0.96, 0.96, 1)", opacity: "0" },
        },
        // Blur — paired with zoom timing; filter is heavier than GPU-only transforms, keep radius modest
        "blur-in": {
          "0%": { opacity: "0", filter: "blur(8px)" },
          "100%": { opacity: "1", filter: "blur(0px)" },
        },
        "blur-out": {
          "0%": { opacity: "1", filter: "blur(0px)" },
          "100%": { opacity: "0", filter: "blur(8px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        // `both` = hold keyframe 0%/100% through the run (avoids one-frame flashes when swapping enter/exit classes)
        // Enter/exit durations paired so backdrop + panel stay in sync; exit easing slightly softer than linear-ish ease-in
        "fade-in": "fade-in 340ms cubic-bezier(0.33, 1, 0.68, 1) both",
        "fade-out": "fade-out 340ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "dialog-backdrop-in":
          "dialog-backdrop-in 420ms cubic-bezier(0.32, 0.72, 0, 1) both",
        "dialog-backdrop-out":
          "dialog-backdrop-out 420ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "slide-in-top":
          "slide-in-top 400ms cubic-bezier(0.32, 0.72, 0, 1) both",
        "slide-out-top":
          "slide-out-top 400ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "slide-in-bottom":
          "slide-in-bottom 420ms cubic-bezier(0.32, 0.72, 0, 1) both",
        "slide-out-bottom":
          "slide-out-bottom 420ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "slide-in-left":
          "slide-in-left 400ms cubic-bezier(0.32, 0.72, 0, 1) both",
        "slide-out-left":
          "slide-out-left 400ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "slide-in-right":
          "slide-in-right 400ms cubic-bezier(0.32, 0.72, 0, 1) both",
        "slide-out-right":
          "slide-out-right 400ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "zoom-in": "zoom-in 380ms cubic-bezier(0.32, 0.72, 0, 1) both",
        "zoom-out": "zoom-out 340ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "blur-in": "blur-in 380ms cubic-bezier(0.32, 0.72, 0, 1) both",
        "blur-out": "blur-out 340ms cubic-bezier(0.4, 0, 0.2, 1) both",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
