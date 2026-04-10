export function _generateRandomString(set: string, length: number) {
  let result = "";

  const values = new Uint8Array(length);

  crypto.getRandomValues(values);

  for (let i = 0; i < length; i++) result += set[values[i] % set.length];

  return result;
}

export const ALPHA_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const ALPHANUMERIC_CHARSET = `${ALPHA_CHARSET}0123456789`;

export const ALPHANUMERICDASH_CHARSET = `${ALPHANUMERIC_CHARSET}-._~`;
