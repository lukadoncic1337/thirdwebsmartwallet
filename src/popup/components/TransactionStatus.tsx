import React from 'react';
import { Spinner } from './Spinner';

interface TransactionStatusProps {
  status: 'idle' | 'pending' | 'success' | 'error';
  txHash?: string;
  explorerUrl?: string;
  error?: string;
  onDone?: () => void;
}

const pillBtn: React.CSSProperties = {
  padding: '8px 20px',
  background: 'var(--bg-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '20px',
  color: 'var(--text-secondary)',
  fontSize: '12px',
  cursor: 'pointer',
  fontFamily: 'var(--font)',
  letterSpacing: '0.02em',
  transition: 'border-color 0.15s, color 0.15s',
  marginTop: '8px',
};

export function TransactionStatus({ status, txHash, explorerUrl, error, onDone }: TransactionStatusProps) {
  if (status === 'idle') return null;

  return (
    <div className="tx-status">
      {status === 'pending' && (
        <>
          <Spinner size="lg" />
          <p style={{ fontSize: '14px' }}>Sending...</p>
          <p className="text-small text-secondary">This may take a moment</p>
        </>
      )}
      {status === 'success' && (
        <>
          <div className="tx-status-icon text-success">&#10003;</div>
          <p style={{ fontSize: '14px' }}>Sent</p>
          {txHash && explorerUrl && (
            <a
              href={`${explorerUrl}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
            >
              View on explorer
            </a>
          )}
          {onDone && (
            <button style={pillBtn} onClick={onDone}>Done</button>
          )}
        </>
      )}
      {status === 'error' && (
        <>
          <div className="tx-status-icon text-error">&#10007;</div>
          <p style={{ fontSize: '14px' }}>Failed</p>
          {error && <p className="text-small text-error">{error}</p>}
          {onDone && (
            <button style={pillBtn} onClick={onDone}>Try again</button>
          )}
        </>
      )}
    </div>
  );
}
