import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";

function passphraseDigest(passphrase: string): string {
	return createHash("sha256")
		.update("poe2drops-guide-passphrase:v1:")
		.update(passphrase, "utf8")
		.digest("hex");
}

export async function hashPassphrase(passphrase: string): Promise<string> {
	return bcrypt.hash(passphraseDigest(passphrase), 10);
}

export async function verifyPassphrase(
	passphrase: string,
	hash: string,
): Promise<boolean> {
	return bcrypt.compare(passphraseDigest(passphrase), hash);
}

export async function hashSecret(secret: string): Promise<string> {
	return bcrypt.hash(secret, 10);
}

export async function verifySecret(
	secret: string,
	hash: string,
): Promise<boolean> {
	return bcrypt.compare(secret, hash);
}
