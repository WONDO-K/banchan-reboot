import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  build: {
    outDir: "dist",
  },
  base: '/m',  // 모든 경로에 /m을 붙이도록 설정
});
