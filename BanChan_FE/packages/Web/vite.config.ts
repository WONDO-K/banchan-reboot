import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    "process.env": process.env,
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://i11e105.p.ssafy.io", // 실제 API 서버 주소
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
