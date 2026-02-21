// @ts-check

/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
module.exports = {
  // Standard prettier options

  printWidth: 100,
  singleQuote: true,
  semi: true,
  plugins: ['prettier-plugin-svelte', '@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^prop-types',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/mui/(.*)$',
    '^types$',
    '^@/types/(.*)$',
    '^@/config/(.*)$',
    '^@/lib/(.*)$',
    '^@/_mock/(.*)$',
    '^@/app/(.*)$',
    '^@/assets/(.*)$',
    '^@/auth/(.*)$',
    '^@/components/(.*)$',
    '^@/contexts/(.*)$',
    '^@/hooks/(.*)$',
    '^@/layouts/(.*)$',
    '^@/redux/(.*)$',
    '^@/routes/(.*)$',
    '^@/sections/(.*)$',
    '^@/services/(.*)$',
    '^@/theme/(.*)$',
    '^@/utils/(.*)$',
    '',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
};
