import { randomBytes } from "crypto";

export function generateVoucherCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  let code = "KFC-WIN-";
  for (const byte of bytes) {
    code += chars[byte % chars.length];
  }
  return code;
}
