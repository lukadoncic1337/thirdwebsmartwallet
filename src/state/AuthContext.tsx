import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { hasWallet, getSessionKey, decryptAndLoadKey, saveEncryptedKey, lockWallet, clearAllData } from '../services/storage/SecureStorage';

type AuthStatus = 'loading' | 'no_wallet' | 'locked' | 'unlocked';

interface AuthContextValue {
  status: AuthStatus;
  privateKey: string | null;
  unlock: (password: string) => Promise<void>;
  importWallet: (privateKey: string, password: string) => Promise<void>;
  lock: () => Promise<void>;
  reset: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  status: 'loading',
  privateKey: null,
  unlock: async () => {},
  importWallet: async () => {},
  lock: async () => {},
  reset: async () => {},
  refreshStatus: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const refreshStatus = useCallback(async () => {
    const walletExists = await hasWallet();
    if (!walletExists) {
      setStatus('no_wallet');
      setPrivateKey(null);
      return;
    }
    const sessionKey = await getSessionKey();
    if (sessionKey) {
      setStatus('unlocked');
      setPrivateKey(sessionKey);
    } else {
      setStatus('locked');
      setPrivateKey(null);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const unlock = async (password: string) => {
    const key = await decryptAndLoadKey(password);
    setPrivateKey(key);
    setStatus('unlocked');
  };

  const importWallet = async (key: string, password: string) => {
    await saveEncryptedKey(key, password);
    await decryptAndLoadKey(password);
    setPrivateKey(key);
    setStatus('unlocked');
  };

  const lock = async () => {
    await lockWallet();
    setPrivateKey(null);
    setStatus('locked');
  };

  const reset = async () => {
    await clearAllData();
    setPrivateKey(null);
    setStatus('no_wallet');
  };

  return (
    <AuthContext.Provider value={{ status, privateKey, unlock, importWallet, lock, reset, refreshStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
