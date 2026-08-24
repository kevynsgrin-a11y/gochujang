import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

/**
 * Do not ship draft ingredient quantities or method text in a public preview
 * bundle. The source catalog remains available to the internal review process;
 * the browser receives only the descriptive, non-procedural fields required by
 * this controlled release.
 */
function controlledPreviewCatalog() {
  const catalogFile = path.resolve(__dirname, './src/data/catalog.json')
  return {
    name: 'controlled-preview-catalog',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      if (path.resolve(id.split('?')[0]) !== catalogFile) return null
      const catalog = JSON.parse(code)
      catalog.dishes = (catalog.dishes ?? []).map(({ ingredients, method, ...dish }: Record<string, unknown>) => {
        void ingredients
        void method
        return dish
      })
      return { code: JSON.stringify(catalog), map: null }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [controlledPreviewCatalog(), react()],
  resolve: {
    // The source module stays available to TypeScript and local tooling, while
    // Vite builds the controlled-preview client metadata layer. It keeps a
    // client-side navigation from undoing the static noindex/JSON-LD posture.
    alias: [
      {
        find: '@/lib/usePageMeta',
        replacement: path.resolve(__dirname, './scripts/preview-page-meta.ts'),
      },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
  },
})
