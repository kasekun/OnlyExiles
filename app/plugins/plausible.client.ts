export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	const domain = config.public.plausibleDomain as string | undefined;
	if (!domain) return;

	useHead({
		script: [
			{
				innerHTML: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
			},
			{
				src: "/koguma.js",
				defer: true,
				"data-domain": domain,
			},
		],
	});
});
