import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/sayim_app/",
  server: {
    host: true,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
