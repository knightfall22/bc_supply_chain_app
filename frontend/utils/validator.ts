import { PublicKey } from "@solana/web3.js";

function isValidPublicKey(value: string): boolean {
  try {
    new PublicKey(value);
    return true;
  } catch {
    return false;
  }
}

export { isValidPublicKey };
