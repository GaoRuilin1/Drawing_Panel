import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/draw/', // 👈 加这一行，指向 GitHub Pages 子路径
  plugins: [react()],
})