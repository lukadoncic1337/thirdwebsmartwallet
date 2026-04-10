import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';
import { useWallet } from '../../state/WalletContext';
import { fetchTokenMetadata, type TokenMetadata } from '../../core/tokens/TokenService';
import { loadTokens, addToken, removeToken, type StoredToken } from '../../services/storage/TokenStorage';

interface TokenManagementScreenProps {
  onBack: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function TokenManagementScreen({ onBack, showToast }: TokenManagementScreenProps) {
  const { accountInfo, refreshBalances } = useWallet();
  const [tokens, setTokens] = useState<StoredToken[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [lookupResult, setLookupResult] = useState<TokenMetadata | null>(null);
  const [looking, setLooking] = useState(false);

  useEffect(() => {
    loadTokens().then(setTokens);
  }, []);

  const handleLookup = async () => {
    if (!accountInfo || !newAddress.match(/^0x[a-fA-F0-9]{40}$/)) return;
    setLooking(true);
    setLookupResult(null);
    try {
      const meta = await fetchTokenMetadata(accountInfo.publicClient, newAddress);
      setLookupResult(meta);
    } catch {
      showToast('Could not fetch token info. Check the address.', 'error');
    } finally {
      setLooking(false);
    }
  };

  const handleAdd = async () => {
    if (!lookupResult) return;
    const updated = await addToken({
      address: lookupResult.address,
      name: lookupResult.name,
      symbol: lookupResult.symbol,
      decimals: lookupResult.decimals,
    });
    setTokens(updated);
    setNewAddress('');
    setLookupResult(null);
    showToast(`${lookupResult.symbol} added`, 'success');
    refreshBalances();
  };

  const handleRemove = async (address: string) => {
    const updated = await removeToken(address);
    setTokens(updated);
    showToast('Token removed', 'success');
    refreshBalances();
  };

  return (
    <>
      <Header title="Manage Tokens" onBack={onBack} />
      <div className="screen flex flex-col gap-16">
        {/* Add Token */}
        <div className="card flex flex-col gap-12">
          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Add Token</h3>
          <Input
            placeholder="Token contract address (0x...)"
            value={newAddress}
            onChange={(e) => { setNewAddress(e.target.value); setLookupResult(null); }}
          />
          <Button
            variant="secondary"
            onClick={handleLookup}
            disabled={!newAddress.match(/^0x[a-fA-F0-9]{40}$/)}
            loading={looking}
          >
            Lookup Token
          </Button>
          {lookupResult && (
            <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
              <p><strong>{lookupResult.symbol}</strong> – {lookupResult.name}</p>
              <p className="text-small text-secondary">Decimals: {lookupResult.decimals}</p>
              <Button block className="mt-8" onClick={handleAdd}>
                Add {lookupResult.symbol}
              </Button>
            </div>
          )}
        </div>

        {/* Token List */}
        <div className="flex flex-col gap-8">
          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Added Tokens ({tokens.length})</h3>
          {tokens.length === 0 ? (
            <p className="text-secondary text-small">No custom tokens added</p>
          ) : (
            tokens.map((t) => (
              <div key={t.address} className="card flex justify-between items-center" style={{ padding: '12px' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '14px' }}>{t.symbol}</p>
                  <p className="text-small text-secondary">{t.name}</p>
                </div>
                <button
                  onClick={() => handleRemove(t.address)}
                  style={{
                    padding: '4px 10px',
                    background: 'transparent',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '12px',
                    color: 'var(--error)',
                    fontSize: '10px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font)',
                    letterSpacing: '0.03em',
                    transition: 'background 0.15s',
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
