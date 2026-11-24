import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

const VENDOR_CHUNKS: Record<string, string[]> = {
  'vendor-map': ['leaflet', 'react-leaflet', '@react-leaflet'],
  'vendor-charts': ['@tremor', 'recharts', 'd3-'],
  'vendor-motion': ['framer-motion', 'motion-dom', 'motion-utils'],
  'vendor-geo': ['@turf'],
}

const vendorChunk = (id: string) => {
  if (!id.includes('node_modules')) return undefined
  return Object.keys(VENDOR_CHUNKS).find((chunk) =>
    VENDOR_CHUNKS[chunk].some((name) => id.includes(`/node_modules/${name}`)),
  )
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss(), svgr()],
  esbuild: { drop: command === "build" ? ["console", "debugger"] : [] },
  build: {
    rollupOptions: {
      output: { manualChunks: vendorChunk },
    },
  },
}))
