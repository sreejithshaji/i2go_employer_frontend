import js from '@eslint/js'
import nextVitals from 'eslint-config-next/core-web-vitals'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  ...nextVitals,
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended],
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
