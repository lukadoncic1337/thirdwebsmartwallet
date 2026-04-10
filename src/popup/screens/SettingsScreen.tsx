import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useSettings } from '../../state/SettingsContext';
import { useAuth } from '../../state/AuthContext';
import { NETWORK_PRESETS } from '../../shared/chains';
import { saveTokens } from '../../services/storage/TokenStorage';
import type { WalletSettings } from '../../services/storage/SettingsStorage';

interface SettingsScreenProps {
  onBack: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function SettingsScreen({ onBack, showToast }: SettingsScreenProps) {
  const { settings, updateSettings } = useSettings();
  const { reset, lock } = useAuth();
  const [form, setForm] = useState<WalletSettings>(settings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const updateField = (field: keyof WalletSettings, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await updateSettings(form);
    const preset = NETWORK_PRESETS.find((p) => p.name === form.chainName);
    if (preset) {
      await saveTokens(preset.defaultTokens);
    }
    showToast('Saved', 'success');
    onBack();
  };

  const applyPreset = (presetName: string) => {
    const preset = NETWORK_PRESETS.find((p) => p.name === presetName);
    if (!preset) return;
    setForm((prev) => ({
      ...prev,
      chainId: preset.chain.id,
      chainName: preset.name,
      rpcUrl: preset.rpcUrl,
      bundlerUrl: preset.bundlerUrl,
      blockExplorer: preset.blockExplorer,
      nativeCurrencySymbol: preset.nativeCurrency.symbol,
    }));
  };

  const handleReset = async () => {
    await reset();
    showToast('Wallet reset', 'success');
  };

  return (
    <>
      <Header title="Settings" onBack={onBack} />
      <div className="screen flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Network
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {NETWORK_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p.name)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  border: form.chainName === p.name ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: form.chainName === p.name ? 'var(--accent-dim)' : 'transparent',
                  color: form.chainName === p.name ? 'var(--accent)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font)',
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <Input label="RPC URL" value={form.rpcUrl} onChange={(e) => updateField('rpcUrl', e.target.value)} />
        <Input label="Bundler URL" value={form.bundlerUrl} onChange={(e) => updateField('bundlerUrl', e.target.value)} />
        <Input label="Chain ID" type="number" value={form.chainId} onChange={(e) => updateField('chainId', parseInt(e.target.value) || 0)} />
        <Input label="Chain Name" value={form.chainName} onChange={(e) => updateField('chainName', e.target.value)} />
        <Input label="Explorer URL" value={form.blockExplorer} onChange={(e) => updateField('blockExplorer', e.target.value)} />

        <div className="divider" />

        <label style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Account
        </label>
        <Input label="Entry Point" value={form.entryPoint} onChange={(e) => updateField('entryPoint', e.target.value)} />
        <Input label="Factory" value={form.factoryAddress} onChange={(e) => updateField('factoryAddress', e.target.value)} />
        <Input label="Auto-lock (min)" type="number" value={form.autoLockMinutes} onChange={(e) => updateField('autoLockMinutes', parseInt(e.target.value) || 5)} />

        <Button block onClick={handleSave}>Save</Button>

        <div className="divider" />

        <Button block variant="secondary" onClick={lock}>Lock</Button>
        <Button block variant="danger" onClick={() => setShowResetConfirm(true)}>Reset Wallet</Button>
      </div>

      {showResetConfirm && (
        <Modal onClose={() => setShowResetConfirm(false)}>
          <div className="flex flex-col gap-16 text-center">
            <h3 style={{ fontSize: '15px', fontWeight: 500 }}>Reset wallet?</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              This permanently deletes your encrypted key and settings.
            </p>
            <div className="flex gap-8">
              <Button block variant="secondary" onClick={() => setShowResetConfirm(false)}>Cancel</Button>
              <Button block variant="danger" onClick={handleReset}>Reset</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
