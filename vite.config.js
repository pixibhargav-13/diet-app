import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react",
              test: /node_modules[\\/]react|node_modules[\\/]react-dom|node_modules[\\/]react-router|node_modules[\\/]react-router-dom/,
              priority: 30,
            },
            {
              name: "charts",
              test: /node_modules[\\/]recharts/,
              priority: 20,
            },
            {
              name: "query",
              test: /node_modules[\\/]@tanstack[\\/]react-query/,
              priority: 20,
            },
            {
              name: "ui",
              test: /node_modules[\\/]@headlessui[\\/]react|node_modules[\\/]@heroicons[\\/]react|node_modules[\\/]lucide-react/,
              priority: 15,
            },
          ],
        },
      },
    },
  },
});
