export function getPhantomProvider() {
  if (typeof window === "undefined") return null;

  const anyWindow = window as any;

  if (anyWindow.solana?.isPhantom) {
    return anyWindow.solana;
  }

  return null;
}

export function isPhantomMobile() {
  if (typeof navigator === "undefined") return false;

  return /Phantom/i.test(navigator.userAgent);
}

export function openInPhantom(url: string) {
  const encoded = encodeURIComponent(url);
  window.location.href = `phantom://browse/${encoded}`;
}
