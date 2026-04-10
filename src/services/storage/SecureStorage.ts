import { encrypt, decrypt, type EncryptedData } from '../crypto/EncryptionService';
import { sendMessage } from '../messaging/MessageBus';
import { ENCRYPTED_KEY } from '../../shared/constants';
import { StorageError } from '../../shared/errors';

export async function saveEncryptedKey(privateKey: string, password: string): Promise<void> {
  const encrypted = await encrypt(privateKey, password);
  await chrome.storage.local.set({ [ENCRYPTED_KEY]: encrypted });
}

export async function decryptAndLoadKey(password: string): Promise<string> {
  const result = await chrome.storage.local.get(ENCRYPTED_KEY);
  const encrypted = result[ENCRYPTED_KEY] as EncryptedData | undefined;
  if (!encrypted) {
    throw new StorageError('No encrypted key found');
  }
  const privateKey = await decrypt(encrypted, password);
  // Store in session
  await sendMessage({ type: 'SET_SESSION_KEY', payload: privateKey });
  return privateKey;
}

export async function getSessionKey(): Promise<string | null> {
  const response = await sendMessage({ type: 'GET_SESSION_KEY' });
  if (response.success) {
    // Reset timer on activity
    if (response.data) {
      await sendMessage({ type: 'RESET_LOCK_TIMER' });
    }
    return response.data as string | null;
  }
  return null;
}

export async function hasWallet(): Promise<boolean> {
  const result = await chrome.storage.local.get(ENCRYPTED_KEY);
  return !!result[ENCRYPTED_KEY];
}

export async function lockWallet(): Promise<void> {
  await sendMessage({ type: 'LOCK_WALLET' });
}

export async function clearAllData(): Promise<void> {
  await sendMessage({ type: 'CLEAR_SESSION' });
  await chrome.storage.local.clear();
}
