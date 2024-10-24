import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output : {
        format: "iife",
        entryFileNames: 'assets/trendify.js'
      }
    }
  },
  plugins: [react()],
  optimizeDeps: {
		exclude: ['js-big-decimal']
	}
})
