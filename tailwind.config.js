/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
        display: ['"Gotham Rounded"', "var(--font-fredoka)", "sans-serif"],
      },
      colors: {
        brand: {
          dark: "#311F54", // The main dark purple
          purple: "#7F26D9", // Primary purple
          light: "#EFEEFF", // Light purple bg
          accent: "#F46AA3", // Pink accent
          gray: "#404040", // Text gray
          black: "#01010C", // Deep black for text
          cream: "#FDFCF8", // Page background
        },
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(180deg, #FFFFFF 0%, #FFFBE8 50.48%, #FFF1B3 100%)",
        "text-gradient":
          "linear-gradient(90deg, #7F26D9 0%, #C23CDD 46.63%, #DC2663 100%)",
      },
      boxShadow: {
        nav: "0px 4px 6.7px 0px #0000000F, 0px 1px 2.2px 0px #0000001A, 0px 13px 13.2px 0px #0000000D",
        "card-1": "0px 8px 30px rgba(0,0,0,0.06)",
        "card-2":
          "3px 10px 16.2px 0px #6C45BA14, 0px 2px 4.8px 0px #6C45BA12, 0px 18px 14px 0px #6C45BA0A",
        "card-3":
          "3px 10px 17.2px 0px #6C45BA0D, 0px 2px 6.8px 0px #6C45BA0F, 0px 1px 7px 7px #6C45BA0F",
        "btn-enroll":
          "0px 2px 3.5px 0px #311F5440, 0px 5px 14.6px 0px #311F5469",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        "bounce-slow": "bounce 3s infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
