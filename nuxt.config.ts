import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
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

	// /guide/:id route scaffolded for next plan (save/share backend)
	// router: { routes: [{ path: '/guide/:id', component: '~/pages/guide/[id].vue' }] },

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
