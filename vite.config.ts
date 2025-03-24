import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { getCssVariables } from "./src/lib/utils/parseCssVars";

const cssVars = getCssVariables("src/index.css");

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "Aghrabe",
                short_name: "Aghrabe",
                description: "Mindful gaming tracker",
                theme_color: cssVars["--color-background"] || "#000000",
                background_color: cssVars["--color-background"] || "#000000",
                display: "standalone",
                start_url: "/",
                icons: [
                    {
                        src: "/icons/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/icons/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            workbox: {
                clientsClaim: true,
                skipWaiting: true,
            },
        }),
    ],
});
