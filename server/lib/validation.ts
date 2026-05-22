import { z } from "zod";

export const nameField = z.string().trim().min(1).max(255);

export const passphraseField = z.string().min(8).max(100);

export const stateField = z
	.record(z.string(), z.unknown())
	.refine((v) => v !== null && typeof v === "object" && !Array.isArray(v));

export const CreateGuideBody = z.object({
	name: nameField,
	passphrase: passphraseField,
	state: stateField,
});

export const UpdateGuideBody = z
	.object({
		name: nameField.optional(),
		state: stateField.optional(),
	})
	.refine((b) => b.name !== undefined || b.state !== undefined, {
		message: "At least one of name or state is required",
	});

export const AuthBody = z.object({
	passphrase: passphraseField,
});
