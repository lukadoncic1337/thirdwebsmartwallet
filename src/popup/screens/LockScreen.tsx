import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../../state/AuthContext';

interface LockScreenProps {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function LockScreen({ showToast }: LockScreenProps) {
  const { unlock } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    if (!password) return;
    setLoading(true);
    try {
      await unlock(password);
    } catch {
      showToast('Wrong password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleUnlock();
  };

  return (
    <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', gap: '40px', padding: '60px 32px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h1 style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '-0.01em' }}>
          Locked
        </h1>
      </div>
      <div style={{ width: '100%', maxWidth: '240px' }} className="flex flex-col gap-12">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <Button block onClick={handleUnlock} disabled={!password} loading={loading}>
          Unlock
        </Button>
      </div>
    </div>
  );
}
