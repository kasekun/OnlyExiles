import { randomBytes } from "node:crypto";

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
const MAX_BYTE = Math.floor(256 / ALPHABET.length) * ALPHABET.length;

export function randomSlug(length: number): string {
	let out = "";
	while (out.length < length) {
		const buf = randomBytes(length * 2);
		for (const byte of buf) {
			if (out.length >= length) break;
			if (byte >= MAX_BYTE) continue;
			out += ALPHABET[byte % ALPHABET.length];
		}
	}
	return out;
}

export function generateGuideId(): string {
	return `GD${randomSlug(12)}`;
}

export function generateEditSession(): { sessionId: string; secret: string } {
	return {
		sessionId: `ES${randomSlug(12)}`,
		secret: randomSlug(32),
	};
}
