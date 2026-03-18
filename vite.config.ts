import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig(({ mode }) => {
 const env = loadEnv(mode, ".", "");
 return {
   base: "/", // ✅ ADD THIS LINE
   server: {
     port: 3000,
     host: "0.0.0.0",
     proxy: {
       "/api": {
         target: "http://localhost:8080",
         changeOrigin: true,
         secure: false,
       },
     },
   },
   plugins: [react()],
   resolve: {
     alias: {
       "@": path.resolve(__dirname, "src"),
     },
   },
 };
});