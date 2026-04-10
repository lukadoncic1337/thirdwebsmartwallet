import React from 'react';
import { NETWORK_PRESETS } from '../../shared/chains';
import { saveTokens } from '../../services/storage/TokenStorage';

interface ConfigChoiceScreenProps {
  onDefault: () => void;
  onCustom: () => void;
}

const cardStyle: React.CSSProperties = {
  width: '100%',
  padding: '20px',
  background: 'var(--bg-raised)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'var(--font)',
  transition: 'border-color 0.15s',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

export function ConfigChoiceScreen({ onDefault, onCustom }: ConfigChoiceScreenProps) {
  const handleDefault = async () => {
    const base = NETWORK_PRESETS.find((p) => p.name === 'Base');
    if (base) {
      await saveTokens(base.defaultTokens);
    }
    onDefault();
  };

  return (
    <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', gap: '32px', padding: '48px 28px' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '-0.01em', marginBottom: '8px' }}>
          Configuration
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Choose how to set up your wallet
        </p>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={handleDefault}
          style={{
            ...cardStyle,
            border: '1px solid rgba(212, 160, 23, 0.2)',
            background: 'var(--accent-glow)',
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
            p2p.me
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
            Ready to go
          </span>
        </button>

        <button
          onClick={onCustom}
          style={cardStyle}
        >
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
            Custom setup
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
            Choose network, RPC, factory
          </span>
        </button>
      </div>
    </div>
  );
}
