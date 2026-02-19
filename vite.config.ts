import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from 'vite-plugin-babel';

export default defineConfig({
  base: '/dropzone-investigation/',
  plugins: [
    react(),
    babel({
      babelConfig: {
        plugins: [
          ['babel-plugin-styled-components', { displayName: true, pure: true }],
        ],
      },
    }),
  ],
});
