import React from 'react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function Header({ title, onBack, rightAction }: HeaderProps) {
  return (
    <div className="screen-header">
      {onBack && (
        <button
          onClick={onBack}
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
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      )}
      <h2 style={{ flex: 1 }}>{title}</h2>
      {rightAction}
    </div>
  );
}
