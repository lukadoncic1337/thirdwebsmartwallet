import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { TransactionStatus } from '../components/TransactionStatus';
import { useWallet } from '../../state/WalletContext';
import { useSettings } from '../../state/SettingsContext';
import { sendNativeTransfer } from '../../core/transactions/NativeTransferBuilder';

interface SendNativeScreenProps {
  onBack: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function SendNativeScreen({ onBack, showToast }: SendNativeScreenProps) {
  const { accountInfo, nativeBalance, refreshBalances } = useWallet();
  const { settings } = useSettings();
  const symbol = settings.nativeCurrencySymbol || 'ETH';
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState('');
  const [txError, setTxError] = useState('');

  const isValid = to.match(/^0x[a-fA-F0-9]{40}$/) && parseFloat(amount) > 0;

  const handleSend = async () => {
    if (!accountInfo || !isValid) return;
    setTxStatus('pending');
    setTxError('');
    try {
      const hash = await sendNativeTransfer(
        accountInfo.smartAccountClient,
        to,
        amount
      );
      setTxHash(hash);
      setTxStatus('success');
      refreshBalances();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('balance') || msg.includes('insufficient') || msg.includes('must be at least')) {
        setTxError(`Insufficient ${symbol} for this transaction`);
      } else if (msg.includes('rejected') || msg.includes('denied')) {
        setTxError('Transaction rejected');
      } else {
        setTxError(msg.length > 120 ? msg.slice(0, 120) + '...' : msg);
      }
      setTxStatus('error');
    }
  };

  const handleReset = () => {
    setTxStatus('idle');
    setTxHash('');
    setTxError('');
  };

  if (txStatus !== 'idle') {
    return (
      <>
        <Header title={`Send ${symbol}`} onBack={txStatus !== 'pending' ? onBack : undefined} />
        <div className="screen">
          <TransactionStatus
            status={txStatus}
            txHash={txHash}
            explorerUrl={settings.blockExplorer}
            error={txError}
            onDone={txStatus === 'error' ? handleReset : onBack}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={`Send ${symbol}`} onBack={onBack} />
      <div className="screen flex flex-col gap-16">
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
          {parseFloat(nativeBalance).toFixed(6)} {symbol} available
        </p>
        <Input
          label="Recipient"
          placeholder="0x..."
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
              Amount ({symbol})
            </label>
            <button
              onClick={() => setAmount(nativeBalance)}
              style={{
                padding: '2px 8px',
                background: 'var(--accent-dim)',
                border: '1px solid rgba(212, 160, 23, 0.15)',
                borderRadius: '10px',
                color: 'var(--accent)',
                fontSize: '10px',
                cursor: 'pointer',
                fontFamily: 'var(--font)',
                letterSpacing: '0.03em',
              }}
            >
              MAX
            </button>
          </div>
          <input
            className="input-field"
            type="number"
            step="any"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <Button block onClick={handleSend} disabled={!isValid}>
          Send
        </Button>
      </div>
    </>
  );
}
