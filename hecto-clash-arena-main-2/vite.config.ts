
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Define default environment variables that can be used at runtime
  define: {
    // Use empty strings as defaults for environment variables
    'import.meta.env.VITE_NEXT_PUBLIC_WS_URL': JSON.stringify(process.env.VITE_NEXT_PUBLIC_WS_URL || ''),
    'import.meta.env.VITE_NEXT_PUBLIC_USE_MOCK_WEBSOCKET': JSON.stringify(process.env.VITE_NEXT_PUBLIC_USE_MOCK_WEBSOCKET || 'true'),
  },
}));
