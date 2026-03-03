export function getFingerprint(): string {
  const key = 'grain_fingerprint';
  let fp = localStorage.getItem(key);
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem(key, fp);
  }
  return fp;
}
