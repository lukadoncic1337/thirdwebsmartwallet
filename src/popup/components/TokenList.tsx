import React from 'react';
import { TokenBalanceItem } from './TokenBalanceItem';
import type { TokenBalance } from '../../core/balance/BalanceService';

interface TokenListProps {
  tokens: TokenBalance[];
  onSend?: (tokenAddress: string) => void;
}

export function TokenList({ tokens, onSend }: TokenListProps) {
  if (tokens.length === 0) {
    return (
      <div className="text-center text-secondary" style={{ padding: '20px 0' }}>
        <p className="text-small">No tokens added yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {tokens.map((tb) => (
        <TokenBalanceItem
          key={tb.token.address}
          token={tb.token}
          balance={tb.balance}
          onSend={onSend ? () => onSend(tb.token.address) : undefined}
        />
      ))}
    </div>
  );
}
