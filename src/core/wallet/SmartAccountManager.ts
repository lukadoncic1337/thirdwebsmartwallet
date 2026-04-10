import { createPublicClient, http, type PublicClient, type Chain } from 'viem';
import { createSmartAccountClient } from 'permissionless';
import { toThirdwebSmartAccount } from 'permissionless/accounts';
import { createSigner } from './SignerFactory';
import { SmartAccountError } from '../../shared/errors';
import type { WalletSettings } from '../../services/storage/SettingsStorage';

export interface SmartAccountInfo {
  publicClient: PublicClient;
  smartAccountClient: any;
  smartAccountAddress: string;
  eoaAddress: string;
}

export async function initializeSmartAccount(
  privateKey: string,
  settings: WalletSettings
): Promise<SmartAccountInfo> {
  try {
    const chain: Chain = {
      id: settings.chainId,
      name: settings.chainName,
      nativeCurrency: { name: settings.nativeCurrencySymbol, symbol: settings.nativeCurrencySymbol, decimals: 18 },
      rpcUrls: {
        default: { http: [settings.rpcUrl] },
      },
      blockExplorers: settings.blockExplorer
        ? { default: { name: 'Explorer', url: settings.blockExplorer } }
        : undefined,
    };

    const publicClient = createPublicClient({
      chain,
      transport: http(settings.rpcUrl),
    });

    const signer = createSigner(privateKey);

    const smartAccount = await toThirdwebSmartAccount({
      client: publicClient,
      owner: signer,
      factoryAddress: settings.factoryAddress as `0x${string}`,
      entryPoint: {
        address: settings.entryPoint as `0x${string}`,
        version: '0.6',
      },
    });

    const smartAccountClient = createSmartAccountClient({
      account: smartAccount,
      chain,
      bundlerTransport: http(settings.bundlerUrl),
    });

    return {
      publicClient,
      smartAccountClient: smartAccountClient as any,
      smartAccountAddress: smartAccount.address,
      eoaAddress: signer.address,
    };
  } catch (error) {
    throw new SmartAccountError(
      `Failed to initialize smart account: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
