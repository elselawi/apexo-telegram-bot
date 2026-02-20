export function decode(encoded: string): string {
	const padded = encoded.padEnd(encoded.length + ((4 - (encoded.length % 4)) % 4), '=');
	const base64String = padded.replace(/-/g, '+').replace(/_/g, '/');
	const utf8Bytes = Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
	return new TextDecoder().decode(utf8Bytes);
}
