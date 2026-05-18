import type { Config } from "tailwindcss";

export default {
	content: [
		"./app/components/**/*.{vue,js,ts}",
		"./app/layouts/**/*.vue",
		"./app/pages/**/*.vue",
		"./app/plugins/**/*.{js,ts}",
		"./app/app.vue",
		"./components/**/*.{vue,js,ts}",
	],
	theme: {
		extend: {},
	},
	plugins: [],
} satisfies Config;
