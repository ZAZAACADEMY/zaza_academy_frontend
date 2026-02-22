import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zaza Financial Education",
    short_name: "Zaza",
    description: "Financial education for kids",
    start_url: "/",
    display: "standalone",
    background_color: "#FDFCF8",
    theme_color: "#311F54",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
