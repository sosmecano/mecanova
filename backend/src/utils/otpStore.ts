const otpStore = new Map<string, { code: string; expiresAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of otpStore) {
    if (val.expiresAt < now) otpStore.delete(key);
  }
}, 60000);

export function storeOtp(phone: string, code: string): void {
  otpStore.set(phone, { code, expiresAt: Date.now() + 120_000 });
}

export function verifyOtp(phone: string, code: string): boolean {
  const stored = otpStore.get(phone);
  if (!stored) return false;
  if (stored.expiresAt < Date.now()) {
    otpStore.delete(phone);
    return false;
  }
  if (stored.code !== code) return false;
  otpStore.delete(phone);
  return true;
}

export function consumeOtp(phone: string): boolean {
  return otpStore.delete(phone);
}
