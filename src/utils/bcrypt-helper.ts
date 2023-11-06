import * as bcrypt from 'bcrypt';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const rounds = 10;

const iv = randomBytes(16);
const key = randomBytes(32);

export const bcryptHelper = {
  hashPassword: async (data: string): Promise<string> => {
    return await bcrypt.hash(data, rounds);
  },

  isMatches: async (hash: string, data: string): Promise<boolean> => {
    return await bcrypt.compare(data, hash);
  },

  encrypt: async (
    data: string,
  ): Promise<{ iv: string; encryptedData: string }> => {
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

    return {
      iv: String(iv),
      encryptedData: encrypted.toString('hex'),
    };
  },

  decrypt: async (data: {
    iv: string;
    encryptedData: string;
  }): Promise<string> => {
    const iv = Buffer.from(data.iv, 'hex');
    const encryptedData = Buffer.from(data.encryptedData, 'hex');
    const decipher = createDecipheriv('aes-256-ctr', Buffer.from(key), iv);
    const decryptedData = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);
    return String(decryptedData);
  },
};
