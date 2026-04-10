import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../../state/AuthContext';

interface ImportWalletScreenProps {
  onBack: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
  onSuccess?: () => void;
}

export function ImportWalletScreen({ onBack, showToast, onSuccess }: ImportWalletScreenProps) {
  const { importWallet } = useAuth();
  const [privateKey, setPrivateKey] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = privateKey.length >= 64 && password.length >= 8 && password === confirmPassword;

  const handleImport = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      await importWallet(privateKey, password);
      showToast('Wallet imported', 'success');
      onSuccess?.();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Import failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Import" onBack={onBack} />
      <div className="screen flex flex-col gap-16">
        <Input
          label="Private Key"
          type="password"
          placeholder="Hex-encoded private key"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          autoComplete="off"
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm"
          type="password"
          placeholder="Repeat password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {password && confirmPassword && password !== confirmPassword && (
          <p className="text-error text-small">Passwords do not match</p>
        )}
        <Button block onClick={handleImport} disabled={!isValid} loading={loading}>
          Import & Encrypt
        </Button>
        <p style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          Encrypted with AES-256-GCM. Password is never stored.
        </p>
      </div>
    </>
  );
}
