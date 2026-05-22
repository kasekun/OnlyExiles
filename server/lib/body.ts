import type { H3Event } from "h3";
import { createError, getHeader, readRawBody } from "h3";

export const MAX_GUIDE_BODY_BYTES = 131_072; // 128 KB

export async function readSizedJsonBody<T>(
	event: H3Event,
	maxBytes = MAX_GUIDE_BODY_BYTES,
): Promise<T> {
	const contentLength = Number(getHeader(event, "content-length") ?? 0);
	if (Number.isFinite(contentLength) && contentLength > maxBytes) {
		throw createError({ statusCode: 413, message: "Request body too large" });
	}

	const raw = await readRawBody(event, "utf8");
	if (!raw) return {} as T;

	if (Buffer.byteLength(raw, "utf8") > maxBytes) {
		throw createError({ statusCode: 413, message: "Request body too large" });
	}

	try {
		return JSON.parse(raw) as T;
	} catch {
		throw createError({ statusCode: 400, message: "Invalid JSON body" });
	}
}
