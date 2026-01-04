import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            import: importPlugin,
            "no-relative-import-paths": noRelativeImportPaths,
        },
        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.json",
                },
            },
        },
        rules: {
            "import/no-cycle": "error",
            "import/no-restricted-paths": [
                "error",
                {
                    zones: [
                        {
                            target: "./src/web-ui/map",
                            from: "./src/web-ui/hud",
                            message:
                                "map module should not import from hud module",
                        },
                        {
                            target: "./src/web-ui/hud",
                            from: "./src/web-ui/map",
                            message:
                                "hud module should not import from map module",
                        },
                    ],
                },
            ],
            "no-relative-import-paths/no-relative-import-paths": [
                "error",
                {
                    allowSameFolder: true,
                    prefix: "@",
                },
            ],
        },
    },
);
