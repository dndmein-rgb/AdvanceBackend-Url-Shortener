// import crypto from "node:crypto";

// const BASE62_ALPHABET =
//   "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// export function generateShortCode(length = 6): string {
//   const bytes = crypto.randomBytes(length);

//   let result = "";
//   for (let i = 0; i < length; i++) {
//     result += BASE62_ALPHABET[bytes[i] % BASE62_ALPHABET.length];
//   }
//   return result;
// }

import { nanoid } from "nanoid";

const SHORT_CODE_LENGTH = 7;
export function generateShortCode(): string{
  return nanoid(SHORT_CODE_LENGTH)
}
export function generateShortUrlCacheKey(shortCode: string): string{
  return `shortCode:${shortCode}`
}

