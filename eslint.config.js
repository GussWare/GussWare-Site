import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["dist/", ".astro/", "node_modules/"],
    },
    ...eslintPluginAstro.configs.recommended,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            parser: tseslint.parser,
        },
    },
);
