import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons.svg"],
      manifest: {
        name: "駅スタンプ帳",
        short_name: "駅スタンプ",
        description: "東京23区内のJR駅を巡って、訪問済みの駅を記録するアプリです。",
        theme_color: "#4f46e5",
        background_color: "#f5f7fb",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icons.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      }
    })
  ]
});