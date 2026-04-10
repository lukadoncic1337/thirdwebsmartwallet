import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';
import { initializeSmartAccount, type SmartAccountInfo } from '../core/wallet/SmartAccountManager';
import { getNativeBalance, getAllTokenBalances, type TokenBalance } from '../core/balance/BalanceService';
import { loadTokens, type StoredToken } from '../services/storage/TokenStorage';

interface WalletContextValue {
  smartAccountAddress: string | null;
  eoaAddress: string | null;
  nativeBalance: string;
  tokenBalances: TokenBalance[];
  accountInfo: SmartAccountInfo | null;
  loading: boolean;
  error: string | null;
  deployed: boolean | null;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue>({
  smartAccountAddress: null,
  eoaAddress: null,
  nativeBalance: '0',
  tokenBalances: [],
  accountInfo: null,
  loading: false,
  error: null,
  deployed: null,
  refreshBalances: async () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { status, privateKey } = useAuth();
  const { settings } = useSettings();
  const [accountInfo, setAccountInfo] = useState<SmartAccountInfo | null>(null);
  const [nativeBalance, setNativeBalance] = useState('0');
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deployed, setDeployed] = useState<boolean | null>(null);

  const refreshBalances = useCallback(async () => {
    if (!accountInfo) return;
    try {
      const bytecode = await accountInfo.publicClient.getCode({
        address: accountInfo.smartAccountAddress as `0x${string}`,
      });
      setDeployed(!!bytecode && bytecode !== '0x');

      const { balance } = await getNativeBalance(
        accountInfo.publicClient,
        accountInfo.smartAccountAddress
      );
      setNativeBalance(balance);

      const tokens: StoredToken[] = await loadTokens();
      if (tokens.length > 0) {
        const balances = await getAllTokenBalances(
          accountInfo.publicClient,
          tokens,
          accountInfo.smartAccountAddress
        );
        setTokenBalances(balances);
      }
    } catch {
      // Silently fail balance refresh
    }
  }, [accountInfo]);

  useEffect(() => {
    if (status !== 'unlocked' || !privateKey) {
      setAccountInfo(null);
      setNativeBalance('0');
      setTokenBalances([]);
      setDeployed(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    initializeSmartAccount(privateKey, settings)
      .then(async (info) => {
        if (cancelled) return;
        setAccountInfo(info);

        try {
          const bytecode = await info.publicClient.getCode({
            address: info.smartAccountAddress as `0x${string}`,
          });
          if (!cancelled) setDeployed(!!bytecode && bytecode !== '0x');
        } catch {
          if (!cancelled) setDeployed(null);
        }

        const { balance } = await getNativeBalance(
          info.publicClient,
          info.smartAccountAddress
        );
        if (cancelled) return;
        setNativeBalance(balance);

        const tokens = await loadTokens();
        if (tokens.length > 0 && !cancelled) {
          const balances = await getAllTokenBalances(
            info.publicClient,
            tokens,
            info.smartAccountAddress
          );
          if (!cancelled) setTokenBalances(balances);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to initialize wallet');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [status, privateKey, settings]);

  return (
    <WalletContext.Provider
      value={{
        smartAccountAddress: accountInfo?.smartAccountAddress ?? null,
        eoaAddress: accountInfo?.eoaAddress ?? null,
        nativeBalance,
        tokenBalances,
        accountInfo,
        loading,
        error,
        deployed,
        refreshBalances,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
