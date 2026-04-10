import React, { useState } from 'react';
import { AddressDisplay } from '../components/AddressDisplay';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';
import { TokenList } from '../components/TokenList';
import { useWallet } from '../../state/WalletContext';
import { useAuth } from '../../state/AuthContext';
import { useSettings } from '../../state/SettingsContext';
import { NETWORK_PRESETS } from '../../shared/chains';
import { saveTokens } from '../../services/storage/TokenStorage';

interface DashboardScreenProps {
  onSendNative: () => void;
  onSendERC20: (tokenAddress: string) => void;
  onManageTokens: () => void;
  onSettings: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function DashboardScreen({
  onSendNative,
  onSendERC20,
  onManageTokens,
  onSettings,
  showToast,
}: DashboardScreenProps) {
  const { smartAccountAddress, nativeBalance, tokenBalances, loading, error, deployed, accountInfo, refreshBalances } = useWallet();
  const { lock } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [deploying, setDeploying] = useState(false);
  const [showNetworkPicker, setShowNetworkPicker] = useState(false);

  const switchNetwork = async (presetName: string) => {
    const preset = NETWORK_PRESETS.find((p) => p.name === presetName);
    if (!preset) return;
    await updateSettings({
      ...settings,
      chainId: preset.chain.id,
      chainName: preset.name,
      rpcUrl: preset.rpcUrl,
      bundlerUrl: preset.bundlerUrl,
      blockExplorer: preset.blockExplorer,
      nativeCurrencySymbol: preset.nativeCurrency.symbol,
    });
    await saveTokens(preset.defaultTokens);
    setShowNetworkPicker(false);
  };

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
        <Spinner size="lg" />
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>LOADING</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', gap: '16px', padding: '40px' }}>
        <p style={{ fontSize: '13px', color: 'var(--error)', textAlign: 'center', lineHeight: 1.5 }}>
          {error.includes('fetch')
            ? 'Could not connect to the network.'
            : error.includes('factory')
            ? 'Account factory not found on this network.'
            : error.length > 120 ? error.slice(0, 120) + '...' : error}
        </p>
        <Button variant="secondary" onClick={onSettings}>Settings</Button>
      </div>
    );
  }

  const handleDeploy = async () => {
    if (!accountInfo?.smartAccountClient) return;
    const bal = parseFloat(nativeBalance);
    if (bal <= 0) {
      showToast(`Fund your wallet with ${currencySymbol} first`, 'error');
      return;
    }
    setDeploying(true);
    try {
      await accountInfo.smartAccountClient.sendTransaction({
        to: smartAccountAddress as `0x${string}`,
        value: 0n,
        data: '0x' as `0x${string}`,
      });
      await refreshBalances();
      showToast('Wallet deployed', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('balance') || msg.includes('insufficient') || msg.includes('must be at least')) {
        showToast(`Insufficient ${currencySymbol} for gas`, 'error');
      } else if (msg.includes('rejected') || msg.includes('denied')) {
        showToast('Transaction rejected', 'error');
      } else {
        showToast(`Deploy failed: ${msg.length > 100 ? msg.slice(0, 100) + '...' : msg}`, 'error');
      }
    } finally {
      setDeploying(false);
    }
  };

  const currencySymbol = settings.nativeCurrencySymbol || 'ETH';
  const displayBalance = parseFloat(nativeBalance).toFixed(6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px 8px',
      }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNetworkPicker(!showNetworkPicker)}
            style={{
              padding: '6px 12px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font)',
              letterSpacing: '0.02em',
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: deployed === true ? 'var(--success)' : deployed === false ? 'var(--warning)' : 'var(--text-muted)',
            }} />
            {settings.chainName}
          </button>
          {showNetworkPicker && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              zIndex: 10,
              minWidth: '160px',
            }}>
              {NETWORK_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => switchNetwork(p.name)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: settings.chainName === p.name ? 'var(--accent-dim)' : 'transparent',
                    border: 'none',
                    color: settings.chainName === p.name ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{p.name}</span>
                  <span style={{ fontSize: '10px', opacity: 0.5 }}>{p.nativeCurrency.symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={onSettings}
            title="Settings"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
          <button
            onClick={lock}
            title="Lock"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="screen flex flex-col" style={{ gap: '24px', paddingTop: '12px' }}>
        {/* Address */}
        {smartAccountAddress && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <AddressDisplay address={smartAccountAddress} />
          </div>
        )}

        {/* Balance */}
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <p style={{
            fontSize: '36px',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            fontFamily: 'var(--mono)',
          }}>
            {displayBalance}
          </p>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginTop: '6px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {currencySymbol}
          </p>
        </div>

        {/* Deploy Banner */}
        {deployed === false && smartAccountAddress && (
          <div style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius)',
            border: '1px solid rgba(234, 179, 8, 0.15)',
            background: 'rgba(234, 179, 8, 0.04)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500, marginBottom: '4px' }}>
              Smart wallet not deployed
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
              Make sure you have {currencySymbol} in your smart wallet address for gas
            </p>
            <Button block loading={deploying} onClick={handleDeploy}>
              Deploy
            </Button>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button block onClick={onSendNative}>Send</Button>
          <Button block variant="secondary" onClick={refreshBalances}>Refresh</Button>
        </div>

        {/* Tokens */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}>
            <span style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>Tokens</span>
            <button
              onClick={onManageTokens}
              style={{
                padding: '4px 10px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                color: 'var(--text-muted)',
                fontSize: '10px',
                cursor: 'pointer',
                fontFamily: 'var(--font)',
                letterSpacing: '0.03em',
                transition: 'border-color 0.15s, color 0.15s',
              }}
            >
              Manage
            </button>
          </div>
          <TokenList tokens={tokenBalances} onSend={onSendERC20} />
        </div>
      </div>
    </div>
  );
}
