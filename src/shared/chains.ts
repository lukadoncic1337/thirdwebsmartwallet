import { type Chain } from 'viem';
import { mainnet, base, optimism, polygon, bsc, baseSepolia, sepolia } from 'viem/chains';
import type { StoredToken } from '../services/storage/TokenStorage';

export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface NetworkPreset {
  name: string;
  chain: Chain;
  rpcUrl: string;
  bundlerUrl: string;
  blockExplorer: string;
  nativeCurrency: NativeCurrency;
  defaultTokens: StoredToken[];
}

const ALCHEMY_KEY = 'mC7cd95n6Csy97rZ1BaXR';

const USDC = (address: string, decimals = 6): StoredToken => ({ address, symbol: 'USDC', name: 'USD Coin', decimals });
const USDT = (address: string, decimals = 6): StoredToken => ({ address, symbol: 'USDT', name: 'Tether USD', decimals });

export const NETWORK_PRESETS: NetworkPreset[] = [
  {
    name: 'Ethereum',
    chain: mainnet,
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    bundlerUrl: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    defaultTokens: [
      USDC('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'),
      USDT('0xdAC17F958D2ee523a2206206994597C13D831ec7'),
    ],
  },
  {
    name: 'Base',
    chain: base,
    rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    bundlerUrl: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    blockExplorer: 'https://basescan.org',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    defaultTokens: [
      USDC('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'),
      USDT('0xfde4C96c8593536E31F0ea4c8f0be1B1d487a6B7'),
    ],
  },
  {
    name: 'Optimism',
    chain: optimism,
    rpcUrl: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    bundlerUrl: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    blockExplorer: 'https://optimistic.etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    defaultTokens: [
      USDC('0x0b2C639c533813f4Aa9D7837CAf62653d53F0C80'),
      USDT('0x94b008aA00579c1307B0EF2c499aD98a8ce58e58'),
    ],
  },
  {
    name: 'Polygon',
    chain: polygon,
    rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    bundlerUrl: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    defaultTokens: [
      USDC('0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'),
      USDT('0xc2132D05D31c914a87C6611C10748AEb04B58e8F'),
    ],
  },
  {
    name: 'BNB Chain',
    chain: bsc,
    rpcUrl: `https://bnb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    bundlerUrl: `https://bnb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    defaultTokens: [
      USDC('0x8AC76a51cc950d9822D68b83FE1Ad97B32Cd580d', 18),
      USDT('0x55d398326f99059fF775485246999027B3197955', 18),
    ],
  },
  {
    name: 'Base Sepolia',
    chain: baseSepolia,
    rpcUrl: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    bundlerUrl: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    blockExplorer: 'https://sepolia.basescan.org',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    defaultTokens: [],
  },
  {
    name: 'Sepolia',
    chain: sepolia,
    rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    bundlerUrl: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    defaultTokens: [],
  },
];
