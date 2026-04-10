import { TOKENS_KEY } from '../../shared/constants';

export interface StoredToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}

export async function loadTokens(): Promise<StoredToken[]> {
  const result = await chrome.storage.local.get(TOKENS_KEY);
  return (result[TOKENS_KEY] as StoredToken[]) || [];
}

export async function saveTokens(tokens: StoredToken[]): Promise<void> {
  await chrome.storage.local.set({ [TOKENS_KEY]: tokens });
}

export async function addToken(token: StoredToken): Promise<StoredToken[]> {
  const tokens = await loadTokens();
  const exists = tokens.some(t => t.address.toLowerCase() === token.address.toLowerCase());
  if (exists) return tokens;
  const updated = [...tokens, token];
  await saveTokens(updated);
  return updated;
}

export async function removeToken(address: string): Promise<StoredToken[]> {
  const tokens = await loadTokens();
  const updated = tokens.filter(t => t.address.toLowerCase() !== address.toLowerCase());
  await saveTokens(updated);
  return updated;
}
