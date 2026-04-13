import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Semua request ke /api akan di-proxy ke apitcg.com
      "/api": {
        target: "https://apitcg.com/api/one-piece",
        changeOrigin: true, // Penting: ubah header Host agar tidak diblokir
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
