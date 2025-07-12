import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  // Load .env file
  const env = loadEnv(mode, process.cwd());

  const backendUrl = env.VITE_BACKEND_URL;
  const backendMediaUrl = env.VITE_BACKEND_URL_MEDIA;

  return {
    server: mode === 'development'
    ? {
        host: "::",
        port: 8080,
        proxy: {
          '/graphql': {
            target: backendUrl,
            changeOrigin: true,
            secure: false,
          },
          '/visit_location_thumbnails': {
            target: backendMediaUrl,
            changeOrigin: true,
            secure: false,
          },
        },
      }
    : undefined,
  
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
