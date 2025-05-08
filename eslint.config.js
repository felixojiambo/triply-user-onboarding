// eslint.config.js
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import typescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  // Vue + TypeScript support in .vue files
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      vue,
      "@typescript-eslint": typescript,
      prettier: prettierPlugin,
    },
    rules: {
      ...vue.configs["flat/recommended"].rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "prettier/prettier": "error",
    },
  },

  // TypeScript-only files (non-Vue)
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      prettier: prettierPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "prettier/prettier": "error",
    },
  },

  // Prettier config disables conflicting rules
  prettierConfig,
];
