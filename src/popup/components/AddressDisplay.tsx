import React, { useState } from 'react';

interface AddressDisplayProps {
  address: string;
  label?: string;
}

export function AddressDisplay({ address, label }: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      title={address}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        fontFamily: 'var(--mono)',
      }}
    >
      {label && (
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.04em', fontFamily: 'var(--font)' }}>
          {label}
        </span>
      )}
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{truncated}</span>
      <span style={{ fontSize: '10px', color: copied ? 'var(--accent)' : 'var(--text-muted)', transition: 'color 0.15s' }}>
        {copied ? 'copied' : 'copy'}
      </span>
    </button>
  );
}
