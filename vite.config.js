import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {REACT_APP_API_PATH : 'http://localhost:8000/api',REACT_APP_API_PATH_MAIN : 'http://localhost:7000/api'}
  }
})
