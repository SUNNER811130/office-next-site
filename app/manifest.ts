import type { MetadataRoute } from "next";

import { brandEntity } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brandEntity.name,
    short_name: brandEntity.shortName,
    description: brandEntity.standardDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#fdfbf8",
    theme_color: "#f5efe6",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };
}
