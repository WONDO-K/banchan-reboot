/** @type {import('tailwindcss').Config} */
import scrollbar from "tailwind-scrollbar";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "./src/styles/main.css",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: "#2D60FF",
        customLineColor: "#EBEEF2",
        customBackgroundColor: "#F6F8FA",
        customButtonColor: "#0075FF",
        customTextColor: "#718EBF",
        customFocusedTextColor: "#2D60FF",
        customSideBarTextColor: "#B1B1B1",
        customRed: "#E95333",
        customGreen: "#00B69B",
        customYellow: "#FFE812",
        customPink: "#FE5C73",
        customInputStyle: "#F3F7FA",
        customMobileHeader: "#F0F8FF",
        customWebRTCHeader: {
          default: "rgba(217,217,217,1)",
          light: "rgba(217,217,217,0.5)", // 투명도 50%
        },
        customWebRTCBackground: "#94BAE0",
      },
      boxShadow: {
        custom: "0 4px 4px rgba(0, 0, 0, 0.1)", // y-4, blur-4
      },
      backgroundImage: {
        "custom-background": "url('/assets/background.png')",
      },
    },
  },
  plugins: [scrollbar],
};
