import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['chart.js', 'chartjs-adapter-date-fns','date-fns']
  },
  resolve: {
    alias: {
      
      'gsap': 'gsap'
    },
   
  }
})
