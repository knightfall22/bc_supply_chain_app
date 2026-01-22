export function toU8Array16(input: string): number[] {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);

  if (bytes.length > 16) {
    throw new Error("Must be 16 bytes or less");
  }

  const arr = new Uint8Array(16);
  arr.set(bytes);

  return Array.from(arr);
}
