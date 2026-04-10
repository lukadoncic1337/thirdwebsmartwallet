import React from 'react';
import { AuthProvider, useAuth } from '../state/AuthContext';
import { SettingsProvider } from '../state/SettingsContext';
import { WalletProvider } from '../state/WalletContext';
import { LockScreen } from './screens/LockScreen';
import { SetupScreen } from './screens/SetupScreen';
import { ImportWalletScreen } from './screens/ImportWalletScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { SendNativeScreen } from './screens/SendNativeScreen';
import { SendERC20Screen } from './screens/SendERC20Screen';
import { TokenManagementScreen } from './screens/TokenManagementScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ConfigChoiceScreen } from './screens/ConfigChoiceScreen';
import { Toast } from './components/Toast';

export type Screen =
  | 'setup'
  | 'import'
  | 'configChoice'
  | 'lock'
  | 'dashboard'
  | 'sendNative'
  | 'sendERC20'
  | 'tokenManagement'
  | 'settings';

function AppContent() {
  const { status } = useAuth();
  const [screen, setScreen] = React.useState<Screen>('dashboard');
  const [sendERC20Token, setSendERC20Token] = React.useState<string>('');
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // Auth-based routing
  if (status === 'loading') {
    return <div className="app-container loading">Loading...</div>;
  }

  if (status === 'no_wallet') {
    if (screen === 'import') {
      return (
        <div className="app-container">
          <ImportWalletScreen onBack={() => setScreen('setup')} showToast={showToast} onSuccess={() => setScreen('configChoice')} />
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
      );
    }
    return (
      <div className="app-container">
        <SetupScreen onImport={() => setScreen('import')} />
      </div>
    );
  }

  if (status === 'locked') {
    return (
      <div className="app-container">
        <LockScreen showToast={showToast} />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // status === 'unlocked'
  const renderScreen = () => {
    switch (screen) {
      case 'configChoice':
        return (
          <ConfigChoiceScreen
            onDefault={() => setScreen('dashboard')}
            onCustom={() => setScreen('settings')}
          />
        );
      case 'sendNative':
        return <SendNativeScreen onBack={() => setScreen('dashboard')} showToast={showToast} />;
      case 'sendERC20':
        return <SendERC20Screen tokenAddress={sendERC20Token} onBack={() => setScreen('dashboard')} showToast={showToast} />;
      case 'tokenManagement':
        return <TokenManagementScreen onBack={() => setScreen('dashboard')} showToast={showToast} />;
      case 'settings':
        return <SettingsScreen onBack={() => setScreen('dashboard')} showToast={showToast} />;
      default:
        return (
          <DashboardScreen
            onSendNative={() => setScreen('sendNative')}
            onSendERC20={(tokenAddr) => { setSendERC20Token(tokenAddr); setScreen('sendERC20'); }}
            onManageTokens={() => setScreen('tokenManagement')}
            onSettings={() => setScreen('settings')}
            showToast={showToast}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <WalletProvider>
          <AppContent />
        </WalletProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
