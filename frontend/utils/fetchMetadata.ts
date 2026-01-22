export interface SealMetadata {
  name: string;
  description?: string;
  image: string;
  properties?: {
    files?: { uri: string; type: string }[];
    category?: string;
  };
}

export async function fetchMetadata<T = any>(uri: string): Promise<T> {
  const res = await fetch(uri);
  if (!res.ok) {
    throw new Error(`Failed to fetch metadata: ${uri}`);
  }
  return res.json();
}
