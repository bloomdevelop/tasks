import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    solid(),
    VitePWA({
      registerType: "prompt",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon-180x180.png", "maskabke-icon-512x512.svg"],
      manifest: {
        name: "Tasks",
        short_name: "Tasks",
        description: "A extremely simple todo app created using solid-js",
        lang: "en",
        id: "/",
        display_override: ["window-controls-overlay"],
        categories: ["productivity", "tasks"],
        display: "standalone",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "screenshots/main_interface_light_desktop.jpeg",
            form_factor: "wide",
            sizes: "1958x1151",
            type: "image/jpeg"
          },
          {
            src: "screenshots/main_interface_dark_desktop.jpeg",
            form_factor: "wide",
            sizes: "1958x1151",
            type: "image/jpeg"
          },
          {
            src: "screenshots/main_interface_light_mobile.jpeg",
            form_factor: "narrow",
            sizes: "512x751",
            type: "image/jpeg"
          },
          {
            src: "screenshots/main_interface_dark_mobile.jpeg",
            form_factor: "narrow",
            sizes: "512x751",
            type: "image/jpeg"
          }
        ]
      },
    }),
  ],
});