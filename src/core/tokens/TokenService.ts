import type { PublicClient } from 'viem';

const erc20MetadataAbi = [
  {
    name: 'name',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
  {
    name: 'symbol',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
  {
    name: 'decimals',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const;

export interface TokenMetadata {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export async function fetchTokenMetadata(
  publicClient: PublicClient,
  tokenAddress: string
): Promise<TokenMetadata> {
  const address = tokenAddress as `0x${string}`;

  const [name, symbol, decimals] = await Promise.all([
    publicClient.readContract({
      address,
      abi: erc20MetadataAbi,
      functionName: 'name',
    }),
    publicClient.readContract({
      address,
      abi: erc20MetadataAbi,
      functionName: 'symbol',
    }),
    publicClient.readContract({
      address,
      abi: erc20MetadataAbi,
      functionName: 'decimals',
    }),
  ]);

  return {
    address: tokenAddress,
    name: name as string,
    symbol: symbol as string,
    decimals: Number(decimals),
  };
}
