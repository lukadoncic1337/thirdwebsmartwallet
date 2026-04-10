import React from 'react';
import type { StoredToken } from '../../services/storage/TokenStorage';

interface TokenBalanceItemProps {
  token: StoredToken;
  balance: string;
  onSend?: () => void;
}

export function TokenBalanceItem({ token, balance, onSend }: TokenBalanceItemProps) {
  const displayBalance = parseFloat(balance).toFixed(Math.min(token.decimals, 6));

  return (
    <div className="token-item">
      <div className="token-item-info">
        <span className="token-item-symbol">{token.symbol}</span>
        <span className="token-item-name">{token.name}</span>
      </div>
      <div className="flex items-center gap-12">
        <div className="token-item-balance">
          <span className="token-item-balance-value">{displayBalance}</span>
        </div>
        {onSend && (
          <button
            onClick={onSend}
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
            Send
          </button>
        )}
      </div>
    </div>
  );
}
