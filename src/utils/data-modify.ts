import * as argon2 from 'argon2';

export function hashData(data: string): Promise<string> {
  return argon2.hash(data);
}

export function verifyData(
  hash: string,
  plain: string | Buffer,
): Promise<boolean> {
  return argon2.verify(hash, plain);
}
