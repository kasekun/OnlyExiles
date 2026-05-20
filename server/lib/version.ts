export function currentVersion(): string {
	const poe = process.env.POE_VERSION ?? "0.4.0k";
	const guide = process.env.GUIDE_VERSION ?? "1.0";
	return `poe-${poe}-g${guide}`;
}
