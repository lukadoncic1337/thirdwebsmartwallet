import { formatEther, formatUnits, type PublicClient } from 'viem';
import type { StoredToken } from '../../services/storage/TokenStorage';

const erc20BalanceAbi = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

export interface TokenBalance {
  token: StoredToken;
  balance: string;
  rawBalance: bigint;
}

export async function getNativeBalance(
  publicClient: PublicClient,
  address: string
): Promise<{ balance: string; rawBalance: bigint }> {
  const rawBalance = await publicClient.getBalance({
    address: address as `0x${string}`,
  });
  return {
    balance: formatEther(rawBalance),
    rawBalance,
  };
}

export async function getERC20Balance(
  publicClient: PublicClient,
  tokenAddress: string,
  walletAddress: string,
  decimals: number
): Promise<{ balance: string; rawBalance: bigint }> {
  const rawBalance = await publicClient.readContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20BalanceAbi,
    functionName: 'balanceOf',
    args: [walletAddress as `0x${string}`],
  });
  return {
    balance: formatUnits(rawBalance as bigint, decimals),
    rawBalance: rawBalance as bigint,
  };
}

export async function getAllTokenBalances(
  publicClient: PublicClient,
  tokens: StoredToken[],
  walletAddress: string
): Promise<TokenBalance[]> {
  const results = await Promise.all(
    tokens.map(async (token) => {
      try {
        const { balance, rawBalance } = await getERC20Balance(
          publicClient,
          token.address,
          walletAddress,
          token.decimals
        );
        return { token, balance, rawBalance };
      } catch {
        return { token, balance: '0', rawBalance: 0n };
      }
    })
  );
  return results;
}
