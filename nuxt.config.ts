import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			link: [
				{ rel: "preconnect", href: "https://fonts.googleapis.com" },
				{
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossorigin: "",
				},
				{
					rel: "preload",
					as: "style",
					href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap",
					onload: "this.onload=null;this.rel='stylesheet'",
				},
				{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
				{
					rel: "icon",
					type: "image/png",
					sizes: "32x32",
					href: "/favicon-32x32.png",
				},
			],
		},
	},

	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	css: ["~/assets/css/tailwind.css"],

	runtimeConfig: {
		public: {
			plausibleDomain: process.env.PLAUSIBLE_DOMAIN ?? "",
		},
	},

	vite: {
		optimizeDeps: {
			include: [
				"class-variance-authority",
				"clsx",
				"lucide-vue-next",
				"reka-ui",
				"tailwind-merge",
			],
		},
		plugins: [tailwindcss()],
	},

	modules: ["shadcn-nuxt"],
});
