import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    legacy(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // Increase from the default 2 MiB to 4 MiB to accommodate
        // the production bundle including framer-motion
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
}));
