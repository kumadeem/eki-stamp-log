import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["app-icon.png", "favicon.svg"],
      manifest: {
        name: "香織の駅巡り",
        short_name: "駅巡り",
        description: "駅巡りの訪問記録アプリです。",
        theme_color: "#4a2b18",
        background_color: "#f7efe2",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/app-icon.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});