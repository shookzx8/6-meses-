import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Se publicar em https://<usuario>.github.io/<repo>, ajuste o base abaixo para '/<repo>/'
  base: '/paraela/',
})
