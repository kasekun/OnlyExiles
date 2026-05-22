/** @type {import("prettier").Config} */
export default {
	plugins: ["prettier-plugin-tailwindcss"],
	// Point at the Tailwind v4 stylesheet so the plugin resolves tokens correctly
	tailwindStylesheet: "./app/assets/css/tailwind.css",
	// Match Biome's formatting - Biome runs after Prettier in `make check` and
	// will re-apply its own rules, so these mostly just prevent Prettier from
	// introducing noise that Biome then has to undo.
	useTabs: true,
	singleQuote: false,
	trailingComma: "all",
	printWidth: 100,
};
