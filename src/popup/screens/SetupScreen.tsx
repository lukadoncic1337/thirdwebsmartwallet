import React from 'react';
import { Button } from '../components/Button';

interface SetupScreenProps {
  onImport: () => void;
}

export function SetupScreen({ onImport }: SetupScreenProps) {
  return (
    <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', gap: '40px', padding: '60px 32px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'var(--accent-dim)',
          border: '1px solid rgba(212, 160, 23, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0l1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>
          </svg>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '10px' }}>
          Smart Wallet
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          ERC-4337 account abstraction wallet.<br />
          Import a private key to begin.
        </p>
      </div>
      <div style={{ width: '100%', maxWidth: '240px' }}>
        <Button block onClick={onImport}>
          Import Key
        </Button>
      </div>
    </div>
  );
}
