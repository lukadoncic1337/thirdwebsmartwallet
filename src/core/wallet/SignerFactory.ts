import { privateKeyToAccount } from 'viem/accounts';
import type { Hex } from 'viem';

export function createSigner(privateKey: string) {
  const key = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  return privateKeyToAccount(key as Hex);
}
