import { SETTINGS_KEY, DEFAULT_RPC_URL, DEFAULT_BUNDLER_URL, DEFAULT_CHAIN_ID, DEFAULT_CHAIN_NAME, DEFAULT_BLOCK_EXPLORER, DEFAULT_AUTO_LOCK_MINUTES, ENTRY_POINT_ADDRESS, THIRDWEB_FACTORY_ADDRESS } from '../../shared/constants';

export interface WalletSettings {
  rpcUrl: string;
  bundlerUrl: string;
  chainId: number;
  chainName: string;
  entryPoint: string;
  factoryAddress: string;
  blockExplorer: string;
  autoLockMinutes: number;
  nativeCurrencySymbol: string;
}

export function getDefaultSettings(): WalletSettings {
  return {
    rpcUrl: DEFAULT_RPC_URL,
    bundlerUrl: DEFAULT_BUNDLER_URL,
    chainId: DEFAULT_CHAIN_ID,
    chainName: DEFAULT_CHAIN_NAME,
    entryPoint: ENTRY_POINT_ADDRESS,
    factoryAddress: THIRDWEB_FACTORY_ADDRESS,
    blockExplorer: DEFAULT_BLOCK_EXPLORER,
    autoLockMinutes: DEFAULT_AUTO_LOCK_MINUTES,
    nativeCurrencySymbol: 'ETH',
  };
}

export async function loadSettings(): Promise<WalletSettings> {
  const result = await chrome.storage.local.get(SETTINGS_KEY);
  const saved = result[SETTINGS_KEY] as Partial<WalletSettings> | undefined;
  return { ...getDefaultSettings(), ...saved };
}

export async function saveSettings(settings: WalletSettings): Promise<void> {
  await chrome.storage.local.set({ [SETTINGS_KEY]: settings });
}
