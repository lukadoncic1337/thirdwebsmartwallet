import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadSettings, saveSettings, type WalletSettings, getDefaultSettings } from '../services/storage/SettingsStorage';

interface SettingsContextValue {
  settings: WalletSettings;
  updateSettings: (settings: WalletSettings) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: getDefaultSettings(),
  updateSettings: async () => {},
  loading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<WalletSettings>(getDefaultSettings());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const updateSettings = async (newSettings: WalletSettings) => {
    await saveSettings(newSettings);
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
