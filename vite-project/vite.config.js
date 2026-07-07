import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Cambiado a @vitejs/plugin-react

export default defineConfig({
  plugins: [react()], // Usa el plugin correcto para React
  // Este bloque "server" es solo para "npm run dev" en tu máquina.
  // En Render ya NO se usa: la app se sirve con "serve -s dist" sobre el
  // build de producción (ver package.json), así que no hace falta
  // allowedHosts ni pisar el puerto acá. Antes apuntaba a un dominio viejo
  // ("amoremio.onrender.com") que no es el actual.
  server: {
    host: '0.0.0.0',
    port: 3005,
  },
});