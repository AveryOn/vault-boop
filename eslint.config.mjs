import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import eslintConfigPrettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...astro.configs.recommended,
  {
    ignores: [
      'dist',
      '.astro',
      'node_modules',
      'drizzle',
      '*.config.js',
      '*.config.mjs',
    ],
  },
  {
    files: ['**/*.{ts,tsx,vue,astro}'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro', '.vue'],
      },
    },
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/no-v-html': 'off',
      '@stylistic/newline-per-chained-call': [
        'error',
        {
          ignoreChainWithDepth: 1,
        },
      ],
    },
  },
  eslintConfigPrettier,
)
