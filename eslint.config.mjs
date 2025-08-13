import { defineConfig, globalIgnores } from "eslint/config";
import jest from "eslint-plugin-jest";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import github from "eslint-plugin-github";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  globalIgnores(["**/dist/", "**/lib/", "**/node_modules/", "**/jest.config.js"]),
  github.getFlatConfigs().browser,
  github.getFlatConfigs().recommended,
  github.getFlatConfigs().react,
  ...github.getFlatConfigs().typescript,
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: {
      jest,
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...jest.environments.globals.globals,
      },

      parser: tsParser,
      ecmaVersion: 9,
      sourceType: "module",

      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    rules: {
      ...typescriptEslint.configs["recommended-type-checked"].rules,
      ...typescriptEslint.configs["stylistic-type-checked"].rules,

      "i18n-text/no-en": "off",
      "eslint-comments/no-use": "off",
      "import/no-namespace": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",

      "@typescript-eslint/explicit-member-accessibility": ["error", {
        accessibility: "no-public",
      }],
    },
  },
  eslintConfigPrettier,
]);
