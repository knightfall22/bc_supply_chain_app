function decodeU8(arr: number[]) {
  return new TextDecoder().decode(Uint8Array.from(arr)).replace(/\0/g, "");
}

export default decodeU8;
