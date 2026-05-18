declare global {
	interface Window {
		plausible?: (
			event: string,
			options?: { props?: Record<string, string | number> },
		) => void;
	}
}

export function usePlausible() {
	const config = useRuntimeConfig();
	const domain = config.public.plausibleDomain as string | undefined;

	function trackEvent(name: string, props?: Record<string, string | number>) {
		if (!import.meta.client) return;
		if (!domain) return;
		if (typeof window.plausible !== "function") return;
		window.plausible(name, props ? { props } : undefined);
	}

	function trackPageview() {
		trackEvent("pageview");
	}

	return { trackEvent, trackPageview };
}
